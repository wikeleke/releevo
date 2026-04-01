// src/middleware/auth.js
const { requireAuth, clerkClient, getAuth } = require('@clerk/express');
const User = require('../models/User');

const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return null;
    const role = rawRole.trim().toLowerCase();
    return ['admin', 'seller', 'buyer'].includes(role) ? role : null;
};

const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    }
    return null;
};

const getMetadataFromClaims = (sessionClaims) => {
    const metadata =
        sessionClaims?.metadata ||
        sessionClaims?.public_metadata ||
        sessionClaims?.publicMetadata ||
        {};
    return {
        role: normalizeRole(metadata?.role),
        isPremium: parseBoolean(metadata?.isPremium),
    };
};

const getMetadataFromClerkUser = (clerkUser) => {
    const metadata = clerkUser?.publicMetadata || clerkUser?.public_metadata || {};
    return {
        role: normalizeRole(metadata?.role),
        isPremium: parseBoolean(metadata?.isPremium),
    };
};

const normalizeEmail = (rawEmail) => {
    if (typeof rawEmail !== 'string') return null;
    const email = rawEmail.trim().toLowerCase();
    return email || null;
};

// Middleware to verify Clerk JWT and attach MongoDB user to request
const protectUser = async (req, res, next) => {
    try {
        const auth = getAuth(req);
        const clerkId = auth?.userId;

        if (!clerkId) {
            return res.status(401).json({ message: 'Not authorized: missing Clerk session' });
        }

        let user = await User.findOne({ clerkId });
        const claimMetadata = getMetadataFromClaims(auth?.sessionClaims);
        
        if (!user) {
            // First time this Clerk user hits the protected route
            const emailFromClaims =
                auth?.sessionClaims?.email ||
                auth?.sessionClaims?.primary_email_address ||
                null;
            let email = emailFromClaims;

            if (!email) {
                const clerkUser = await clerkClient.users.getUser(clerkId);
                email = clerkUser.emailAddresses[0]?.emailAddress || null;
            }
            email = normalizeEmail(email);

            if (!email) {
                return res.status(401).json({ message: 'Not authorized: missing email in session' });
            }
            
            // Link if email already exists
            user = await User.findOne({ email });
            if (user) {
                user.clerkId = clerkId;
                if (claimMetadata.role) user.role = claimMetadata.role;
                if (claimMetadata.isPremium !== null) user.isPremium = claimMetadata.isPremium;
                await user.save();
            } else {
                // Otherwise create new mapping with placeholder password
                user = await User.create({
                    clerkId,
                    email,
                    password: 'clerk_placeholder_password',
                    role: claimMetadata.role || 'buyer',
                    isPremium: claimMetadata.isPremium ?? false,
                });
            }
        }

        // Keep local role/premium in sync with Clerk metadata if available in session claims.
        let changed = false;
        if (claimMetadata.role && user.role !== claimMetadata.role) {
            user.role = claimMetadata.role;
            changed = true;
        }
        if (claimMetadata.isPremium !== null && user.isPremium !== claimMetadata.isPremium) {
            user.isPremium = claimMetadata.isPremium;
            changed = true;
        }

        // Fallback: if claims don't include metadata, fetch Clerk user once and sync.
        if (!changed && !claimMetadata.role && claimMetadata.isPremium === null) {
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const remoteMetadata = getMetadataFromClerkUser(clerkUser);
            if (remoteMetadata.role && user.role !== remoteMetadata.role) {
                user.role = remoteMetadata.role;
                changed = true;
            }
            if (remoteMetadata.isPremium !== null && user.isPremium !== remoteMetadata.isPremium) {
                user.isPremium = remoteMetadata.isPremium;
                changed = true;
            }
        }

        if (changed) {
            await user.save();
        }
        
        // Expose user just like the old middleware did
        req.user = user;
        next();
    } catch (err) {
        console.error('Clerk to Mongo sync error:', err?.message || err);
        return res.status(401).json({ message: 'Not authorized or sync failed' });
    }
};

const protect = [requireAuth(), protectUser];

module.exports = protect;

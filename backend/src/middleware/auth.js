// src/middleware/auth.js
const { requireAuth, clerkClient, getAuth } = require('@clerk/express');
const User = require('../models/User');

const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return 'buyer';
    const role = rawRole.trim().toLowerCase();
    return ['admin', 'seller', 'buyer'].includes(role) ? role : 'buyer';
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
                await user.save();
            } else {
                // Otherwise create new mapping with placeholder password
                user = await User.create({
                    clerkId,
                    email,
                    password: 'clerk_placeholder_password',
                    role: 'buyer',
                    isPremium: false,
                });
            }
        }

        // Normalize persisted role in case it was edited manually with casing/spacing.
        const normalizedExistingRole = normalizeRole(user.role);
        let changed = false;
        if (normalizedExistingRole && user.role !== normalizedExistingRole) {
            user.role = normalizedExistingRole;
            changed = true;
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

// src/middleware/auth.js
const { requireAuth, clerkClient, getAuth } = require('@clerk/express');
const User = require('../models/User');
const {
    roleFromClerkSdkUser,
    shouldUpgradeMongoRole,
    normalizeRole: normalizeRoleStrict,
} = require('../utils/clerkRole');

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
            const emailFromClaims =
                auth?.sessionClaims?.email ||
                auth?.sessionClaims?.primary_email_address ||
                null;
            let email = emailFromClaims;

            const clerkUser = await clerkClient.users.getUser(clerkId);
            if (!email) {
                email = clerkUser.emailAddresses[0]?.emailAddress || null;
            }
            email = normalizeEmail(email);

            if (!email) {
                return res.status(401).json({ message: 'Not authorized: missing email in session' });
            }

            const clerkRole = roleFromClerkSdkUser(clerkUser);
            const initialRole = normalizeRoleStrict(clerkRole) || 'buyer';

            user = await User.findOne({ email });
            if (user) {
                user.clerkId = clerkId;
                if (clerkRole && shouldUpgradeMongoRole(user.role, clerkRole)) {
                    user.role = normalizeRoleStrict(clerkRole);
                }
                await user.save();
            } else {
                user = await User.create({
                    clerkId,
                    email,
                    password: 'clerk_placeholder_password',
                    role: initialRole,
                    isPremium: false,
                });
            }
        } else if (normalizeRole(user.role) === 'buyer') {
            try {
                const clerkUser = await clerkClient.users.getUser(clerkId);
                const clerkRole = roleFromClerkSdkUser(clerkUser);
                if (clerkRole && shouldUpgradeMongoRole(user.role, clerkRole)) {
                    user.role = normalizeRoleStrict(clerkRole);
                    await user.save();
                }
            } catch (syncErr) {
                console.error('Clerk role sync error:', syncErr?.message || syncErr);
            }
        }

        // Normalize persisted role in case it was edited manually with casing/spacing.
        const normalizedExistingRole = normalizeRole(user.role);
        if (normalizedExistingRole && user.role !== normalizedExistingRole) {
            user.role = normalizedExistingRole;
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

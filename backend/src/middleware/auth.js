// src/middleware/auth.js
const { requireAuth, clerkClient } = require('@clerk/express');
const User = require('../models/User');

// Middleware to verify Clerk JWT and attach MongoDB user to request
const protectUser = async (req, res, next) => {
    try {
        const clerkId = req.auth.userId;
        let user = await User.findOne({ clerkId });
        
        if (!user) {
            // First time this Clerk user hits the protected route
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            
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
                    role: 'buyer'
                });
            }
        }
        
        // Expose user just like the old middleware did
        req.user = user;
        next();
    } catch (err) {
        console.error('Clerk to Mongo sync error:', err);
        return res.status(401).json({ message: 'Not authorized or sync failed' });
    }
};

const protect = [requireAuth(), protectUser];

module.exports = protect;

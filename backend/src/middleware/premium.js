// src/middleware/premium.js
// Middleware to ensure the user has a premium subscription before accessing confidential data
module.exports = function checkPremium(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!req.user.isPremium) {
        return res.status(403).json({ message: 'Premium subscription required to access this data' });
    }
    next();
};

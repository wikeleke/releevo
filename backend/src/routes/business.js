// src/routes/business.js
const express = require('express');
const {
    createBusiness,
    getBusinesses,
    getBusinessDetail,
    updateStatus,
    payListing,
    getDashboardBusinesses
} = require('../controllers/businessController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const checkPremium = require('../middleware/premium');

const router = express.Router();

// Private dashboard route (MUST be before /:slug to avoid collision)
router.get('/dashboard', protect, getDashboardBusinesses);

// Public routes
router.get('/', getBusinesses);
router.get('/:slug', protect, getBusinessDetail); // protect to get user info for premium check

// Seller routes
router.post('/', protect, roleCheck(['seller']), createBusiness);
router.put('/:id/paylisting', protect, roleCheck(['seller']), payListing);

// Admin routes
router.put('/:id/status', protect, roleCheck(['admin']), updateStatus);

module.exports = router;

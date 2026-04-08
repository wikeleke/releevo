// src/routes/business.js
const express = require('express');
const {
    createBusiness,
    getBusinesses,
    getBusinessDetail,
    updateStatus,
    payListing,
    cancelOwnListing,
    getDashboardBusinesses
} = require('../controllers/businessController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Private dashboard route (MUST be before /:slug to avoid collision)
router.get('/dashboard', protect, getDashboardBusinesses);

// Public routes (auth opcional: admin / comprador premium / dueño ven nombre real en listado)
router.get('/', protect.optionalAttachUser, getBusinesses);
router.get('/:slug', protect, getBusinessDetail); // protect to get user info for premium check

// Seller/Admin routes
router.post('/', protect, roleCheck(['seller', 'admin']), createBusiness);
router.put('/:id/paylisting', protect, roleCheck(['seller']), payListing);
router.put('/:id/cancel', protect, roleCheck(['seller']), cancelOwnListing);

// Admin routes
router.put('/:id/status', protect, roleCheck(['admin']), updateStatus);

module.exports = router;

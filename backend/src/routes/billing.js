const express = require('express');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
    createBuyerMembershipCheckout,
    createSellerListingCheckout,
    createBillingPortalSession,
} = require('../controllers/billingController');

const router = express.Router();

router.post('/checkout/buyer-membership', protect, roleCheck(['buyer', 'admin']), createBuyerMembershipCheckout);
router.post('/checkout/seller-listing/:businessId', protect, roleCheck(['seller']), createSellerListingCheckout);
router.post('/portal', protect, createBillingPortalSession);

module.exports = router;

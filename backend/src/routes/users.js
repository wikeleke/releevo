const express = require('express');
const protect = require('../middleware/auth');
const {
    getMe,
    completeRoleOnboarding,
    completeSellerOnboarding,
    verifyWebsite,
    onboardingExitFeedback,
    sellerOnboardingOptions,
} = require('../controllers/userController');

const router = express.Router();

router.get('/onboarding/seller-options', sellerOnboardingOptions);
router.get('/me', protect, getMe);
router.post('/onboarding/role', protect, completeRoleOnboarding);
router.post('/onboarding/verify-website', protect, verifyWebsite);
router.post('/onboarding/exit-feedback', protect, onboardingExitFeedback);
router.post('/onboarding/seller', protect, completeSellerOnboarding);

module.exports = router;

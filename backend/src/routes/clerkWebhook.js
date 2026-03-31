const express = require('express');
const { handleClerkWebhook } = require('../controllers/clerkWebhookController');

const router = express.Router();

router.post('/', handleClerkWebhook);

module.exports = router;

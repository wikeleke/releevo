const express = require('express');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
    listConversations,
    openOrCreate,
    getMessages,
    sendMessage,
    unreadTotal,
} = require('../controllers/messageController');

const router = express.Router();

router.use(protect);
router.use(roleCheck(['buyer', 'seller', 'admin']));

router.get('/conversations/unread', unreadTotal);
router.get('/conversations', listConversations);
router.post('/conversations', openOrCreate);
router.get('/conversations/:id', getMessages);
router.post('/conversations/:id/messages', sendMessage);

module.exports = router;

const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessagePreview: { type: String, default: '' },
    buyerUnread: { type: Number, default: 0 },
    sellerUnread: { type: Number, default: 0 },
}, { timestamps: true });

ConversationSchema.index({ business: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', ConversationSchema);

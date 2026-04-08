const mongoose = require('mongoose');

const BuyerListItemSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    addedAt: { type: Date, default: Date.now },
}, { _id: false });

const BuyerListSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    items: [BuyerListItemSchema],
}, { timestamps: true });

BuyerListSchema.index({ buyerId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('BuyerList', BuyerListSchema);

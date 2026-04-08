// src/models/Business.js
const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    // Public fields
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // could be enum of categories
    sector: { type: String },
    giro: { type: String },
    size: { type: String, enum: ['Small', 'Medium', 'Large'] },
    location: {
        city: { type: String },
        state: { type: String },
    },
    financials: {
        askingPrice: { type: Number },
        annualRevenue: { type: Number },
        annualProfit: { type: Number },
    },
    // Confidential data (protected by premium middleware)
    confidentialData: {
        businessName: { type: String },
        exactAddress: { type: String },
        contactPhone: { type: String },
        contactEmail: { type: String },
        website: { type: String },
    },
    // Control fields
    status: { type: String, enum: ['pending', 'accepted', 'published', 'sold', 'cancelled'], default: 'pending' },
    isListingPaid: { type: Boolean, default: false },
    stripeCustomerId: { type: String, default: null },
    stripeListingSubscriptionId: { type: String, default: null },
    listingSubscriptionStatus: { type: String, default: null },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Business', BusinessSchema);

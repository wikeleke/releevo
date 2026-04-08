// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'seller', 'buyer'],
        default: 'buyer',
    },
    /** Clerk: falta elegir vender vs comprar (post-registro). */
    needsRoleOnboarding: {
        type: Boolean,
        default: false,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    stripeCustomerId: {
        type: String,
        default: null,
    },
    stripeBuyerSubscriptionId: {
        type: String,
        default: null,
    },
    buyerSubscriptionStatus: {
        type: String,
        default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    sellerCompanyProfile: {
        companyType: { type: String, default: null },
        companyName: { type: String, default: null },
        website: { type: String, default: null },
        websiteVerifiedAt: { type: Date, default: null },
        owners: [{
            name: { type: String, trim: true },
            companyRole: { type: String, trim: true },
        }],
        address: { type: String, default: null },
        contactPhone: { type: String, default: null },
        contactEmail: { type: String, default: null, lowercase: true, trim: true },
    },
    onboardingExitLog: [{
        reasonCode: { type: String },
        step: { type: String },
        at: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

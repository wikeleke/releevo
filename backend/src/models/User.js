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

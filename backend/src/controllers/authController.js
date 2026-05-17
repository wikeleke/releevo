const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const normalizePublicSignupRole = (rawRole) => {
    return rawRole === 'seller' ? 'seller' : 'buyer';
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create user
        user = new User({ email, password, role: normalizePublicSignupRole(role) });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ token, user: { email: user.email, role: user.role, isPremium: user.isPremium } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.json({ token, user: { email: user.email, role: user.role, isPremium: user.isPremium } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'User not found with that email' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        await user.save({ validateBeforeSave: false });

        // Frontend URL should be dynamic based on origin, for now we assume standard local setup or relative routing
        const resetUrl = `/reset-password/${resetToken}`;
        
        // Return demoLink since an actual email SMTP provider isn't configured
        console.log(`Test Password reset link generated: http://localhost:5173${resetUrl}`);
        
        res.status(200).json({ 
            message: 'Password reset instructions sent. For local testing, use the link provided.', 
            demoLink: resetUrl 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

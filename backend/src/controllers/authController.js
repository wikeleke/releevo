// src/controllers/authController.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
        user = new User({ email, password, role });
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

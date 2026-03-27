// src/routes/auth.js
const express = require('express');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/signup
router.post('/signup', signup);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/forgotpassword
router.post('/forgotpassword', forgotPassword);

// @route   PUT /api/auth/resetpassword/:token
router.put('/resetpassword/:token', resetPassword);

module.exports = router;

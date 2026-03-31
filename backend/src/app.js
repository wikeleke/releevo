// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { clerkMiddleware } = require('@clerk/express');

// Route imports
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const clerkWebhookRoutes = require('./routes/clerkWebhook');

const app = express();

// Middleware
app.use(clerkMiddleware());

// Open CORS configuration for testing with other apps and APIs
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
}));

// Clerk webhooks need raw body to validate signatures.
app.use('/api/clerk/webhooks', express.raw({ type: 'application/json' }), clerkWebhookRoutes);

app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

// Basic health check
app.get('/', (req, res) => res.send('Releevo API is running'));

module.exports = app;

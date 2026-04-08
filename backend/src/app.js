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
const billingRoutes = require('./routes/billing');
const stripeWebhookRoutes = require('./routes/stripeWebhook');
const watchlistRoutes = require('./routes/watchlists');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');

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
app.use('/api/clerk/webhooks', express.raw({ type: '*/*' }), clerkWebhookRoutes);
app.use('/api/stripe/webhooks', express.raw({ type: 'application/json' }), stripeWebhookRoutes);

app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Basic health check
app.get('/', (req, res) => res.send('Releevo API is running'));

module.exports = app;

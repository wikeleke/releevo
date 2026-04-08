const Stripe = require('stripe');

let stripeClient = null;

module.exports = () => {
    const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!secretKey) {
        throw new Error('Missing STRIPE_SECRET_KEY');
    }
    if (!stripeClient) {
        stripeClient = new Stripe(secretKey);
    }
    return stripeClient;
};

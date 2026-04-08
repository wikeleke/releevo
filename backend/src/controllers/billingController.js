const Business = require('../models/Business');
const User = require('../models/User');
const getStripe = require('../config/stripe');

const ACTIVE_STATUSES = ['active', 'trialing'];

const getFrontendUrl = () => {
    return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
};

const getEnv = (key) => (process.env[key] || '').trim();

const ensureStripeCustomer = async (user) => {
    if (user.stripeCustomerId) return user.stripeCustomerId;
    const stripe = getStripe();
    const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
            userId: String(user._id),
            role: String(user.role || ''),
        },
    });
    user.stripeCustomerId = customer.id;
    await user.save();
    return customer.id;
};

exports.createBuyerMembershipCheckout = async (req, res) => {
    try {
        const buyerPriceId = getEnv('STRIPE_BUYER_ANNUAL_PRICE_ID');
        if (!buyerPriceId) {
            return res.status(500).json({ message: 'Missing STRIPE_BUYER_ANNUAL_PRICE_ID' });
        }

        const customerId = await ensureStripeCustomer(req.user);
        const stripe = getStripe();
        const frontendUrl = getFrontendUrl();

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: customerId,
            line_items: [{ price: buyerPriceId, quantity: 1 }],
            success_url: `${frontendUrl}/dashboard?billing=buyer_success`,
            cancel_url: `${frontendUrl}/pricing/buyers?billing=cancelled`,
            allow_promotion_codes: true,
            metadata: {
                subscriptionType: 'buyer_membership',
                userId: String(req.user._id),
            },
            subscription_data: {
                metadata: {
                    subscriptionType: 'buyer_membership',
                    userId: String(req.user._id),
                },
            },
        });

        return res.json({ url: session.url });
    } catch (error) {
        console.error('createBuyerMembershipCheckout error:', error);
        return res.status(500).json({ message: 'Could not create buyer checkout session' });
    }
};

exports.createSellerListingCheckout = async (req, res) => {
    try {
        const sellerPriceId = getEnv('STRIPE_SELLER_MONTHLY_PRICE_ID');
        if (!sellerPriceId) {
            return res.status(500).json({ message: 'Missing STRIPE_SELLER_MONTHLY_PRICE_ID' });
        }

        const business = await Business.findOne({ _id: req.params.businessId, sellerId: req.user._id });
        if (!business) {
            return res.status(404).json({ message: 'Business not found or not owned' });
        }
        if (business.status !== 'accepted') {
            return res.status(400).json({ message: 'Listing must be accepted before starting subscription' });
        }
        if (ACTIVE_STATUSES.includes(String(business.listingSubscriptionStatus || '').toLowerCase())) {
            return res.status(400).json({ message: 'Listing subscription already active' });
        }

        const customerId = await ensureStripeCustomer(req.user);
        const stripe = getStripe();
        const frontendUrl = getFrontendUrl();

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: customerId,
            line_items: [{ price: sellerPriceId, quantity: 1 }],
            success_url: `${frontendUrl}/dashboard?billing=seller_success`,
            cancel_url: `${frontendUrl}/dashboard?billing=cancelled`,
            metadata: {
                subscriptionType: 'seller_listing',
                userId: String(req.user._id),
                businessId: String(business._id),
            },
            subscription_data: {
                metadata: {
                    subscriptionType: 'seller_listing',
                    userId: String(req.user._id),
                    businessId: String(business._id),
                },
            },
        });

        return res.json({ url: session.url });
    } catch (error) {
        console.error('createSellerListingCheckout error:', error);
        return res.status(500).json({ message: 'Could not create seller checkout session' });
    }
};

exports.createBillingPortalSession = async (req, res) => {
    try {
        const customerId = await ensureStripeCustomer(req.user);
        const stripe = getStripe();
        const frontendUrl = getFrontendUrl();
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${frontendUrl}/dashboard`,
        });
        return res.json({ url: session.url });
    } catch (error) {
        console.error('createBillingPortalSession error:', error);
        return res.status(500).json({ message: 'Could not create billing portal session' });
    }
};

const syncBuyerFromSubscription = async (subscription) => {
    const metadata = subscription?.metadata || {};
    const userId = metadata.userId;
    const status = subscription?.status || null;
    const isPremium = ACTIVE_STATUSES.includes(String(status).toLowerCase());

    if (userId) {
        await User.findByIdAndUpdate(userId, {
            stripeCustomerId: subscription.customer || null,
            stripeBuyerSubscriptionId: subscription.id || null,
            buyerSubscriptionStatus: status,
            isPremium,
        });
        return;
    }

    await User.findOneAndUpdate(
        { stripeBuyerSubscriptionId: subscription.id },
        {
            buyerSubscriptionStatus: status,
            isPremium,
        }
    );
};

const syncSellerListingFromSubscription = async (subscription) => {
    const metadata = subscription?.metadata || {};
    const businessId = metadata.businessId;
    const status = subscription?.status || null;
    const isPaid = ACTIVE_STATUSES.includes(String(status).toLowerCase());

    let business = null;
    if (businessId) {
        business = await Business.findById(businessId);
    }
    if (!business) {
        business = await Business.findOne({ stripeListingSubscriptionId: subscription.id });
    }
    if (!business) return;

    business.stripeCustomerId = subscription.customer || business.stripeCustomerId || null;
    business.stripeListingSubscriptionId = subscription.id || business.stripeListingSubscriptionId || null;
    business.listingSubscriptionStatus = status;
    business.isListingPaid = isPaid;

    if (isPaid && business.status === 'accepted') {
        business.status = 'published';
    }

    if (!isPaid) {
        if (business.status === 'published') {
            business.status = 'accepted';
        }
        if (String(status).toLowerCase() === 'canceled' && business.status !== 'sold') {
            business.status = 'cancelled';
        }
    }

    await business.save();
};

const handleCheckoutCompleted = async (session) => {
    const metadata = session?.metadata || {};
    const subscriptionType = metadata.subscriptionType;

    if (subscriptionType === 'buyer_membership') {
        await User.findByIdAndUpdate(metadata.userId, {
            stripeCustomerId: session.customer || null,
            stripeBuyerSubscriptionId: session.subscription || null,
        });
        return;
    }

    if (subscriptionType === 'seller_listing') {
        const business = await Business.findById(metadata.businessId);
        if (!business) return;
        business.stripeCustomerId = session.customer || null;
        business.stripeListingSubscriptionId = session.subscription || null;
        business.listingSubscriptionStatus = 'active';
        business.isListingPaid = true;
        if (business.status === 'accepted') {
            business.status = 'published';
        }
        await business.save();
    }
};

const handleInvoicePaymentFailed = async (invoice) => {
    const subscriptionId = invoice?.subscription;
    if (!subscriptionId) return;

    const business = await Business.findOne({ stripeListingSubscriptionId: subscriptionId });
    if (business) {
        business.isListingPaid = false;
        if (business.status === 'published') {
            business.status = 'accepted';
        }
        business.listingSubscriptionStatus = 'past_due';
        await business.save();
    }

    await User.findOneAndUpdate(
        { stripeBuyerSubscriptionId: subscriptionId },
        {
            isPremium: false,
            buyerSubscriptionStatus: 'past_due',
        }
    );
};

exports.handleStripeWebhook = async (req, res) => {
    try {
        const webhookSecret = getEnv('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            return res.status(500).json({ message: 'Missing STRIPE_WEBHOOK_SECRET' });
        }

        const stripe = getStripe();
        const signature = req.headers['stripe-signature'];
        if (!signature) {
            return res.status(400).json({ message: 'Missing stripe-signature header' });
        }

        const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const subscriptionType = subscription?.metadata?.subscriptionType;
                if (subscriptionType === 'buyer_membership') {
                    await syncBuyerFromSubscription(subscription);
                } else if (subscriptionType === 'seller_listing') {
                    await syncSellerListingFromSubscription(subscription);
                }
                break;
            }
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
            default:
                break;
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error?.message || error);
        return res.status(400).json({ message: 'Stripe webhook handler failed' });
    }
};

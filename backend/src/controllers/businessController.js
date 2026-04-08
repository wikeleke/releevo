// src/controllers/businessController.js
const Business = require('../models/Business');
const slugify = require('slugify');
const getStripe = require('../config/stripe');
const { publicListingLabel, maskedListingDescription } = require('../utils/listingMask');
const { resolveMarketSectorCondition } = require('../utils/marketFilters');

const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return '';
    return rawRole.trim().toLowerCase();
};

const canSeeListingIdentity = (user, business) => {
    if (!user || !business) return false;
    const role = normalizeRole(user.role);
    if (role === 'admin') return true;
    if (user.isPremium) return true;
    const sidRaw = business.sellerId;
    const sid = sidRaw?._id || sidRaw;
    if (sid && String(sid) === String(user._id)) return true;
    return false;
};

// @desc    Create new business listing (seller only)
// @route   POST /api/business
// @access  Private (seller)
exports.createBusiness = async (req, res) => {
    try {
        const { title, description, category, sector, giro, size, location, financials, confidentialData } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const business = new Business({
            title,
            slug,
            description,
            category,
            sector,
            giro,
            size,
            location,
            financials,
            confidentialData,
            sellerId: req.user._id,
            // status stays pending, isListingPaid false by default
        });
        await business.save();
        res.status(201).json(business);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get public list with filters
// @route   GET /api/business
// @access  Public
exports.getBusinesses = async (req, res) => {
    try {
        const { city, sector, giro, minPrice, maxPrice, category, size } = req.query;
        const filter = { status: 'published' };
        if (city) filter['location.city'] = city;
        if (giro) filter.giro = giro;
        if (category) filter.category = category;
        if (size) filter.size = size;
        if (minPrice || maxPrice) {
            filter['financials.askingPrice'] = {};
            if (minPrice) filter['financials.askingPrice'].$gte = Number(minPrice);
            if (maxPrice) filter['financials.askingPrice'].$lte = Number(maxPrice);
        }

        const sectorCond = sector ? resolveMarketSectorCondition(sector) : null;
        const mongoFilter =
            sectorCond && Object.keys(sectorCond).length > 0
                ? { $and: [filter, sectorCond] }
                : filter;

        const businesses = await Business.find(mongoFilter)
            .select('title slug description category sector giro size location financials status sellerId')
            .lean();

        const payload = businesses.map((b) => {
            if (canSeeListingIdentity(req.user, b)) {
                return b;
            }
            return {
                ...b,
                title: publicListingLabel(b),
                description: maskedListingDescription(b),
                isTitleMasked: true,
            };
        });

        res.json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get business detail (public fields always, confidential if premium/admin)
// @route   GET /api/business/:slug
// @access  Public (premium guard inside)
exports.getBusinessDetail = async (req, res) => {
    try {
        const business = await Business.findOne({ slug: req.params.slug }).populate('sellerId', 'email role');
        if (!business) return res.status(404).json({ message: 'Business not found' });
        const role = normalizeRole(req.user?.role);
        const sellerRef = business.sellerId?._id || business.sellerId;
        const isOwner =
            Boolean(req.user && sellerRef && String(sellerRef) === String(req.user._id));
        const canViewConfidential = Boolean(
            req.user && (req.user.isPremium || role === 'admin' || isOwner)
        );

        const bPlain = business.toObject ? business.toObject() : business;

        const response = {
            _id: business._id,
            title: canViewConfidential ? business.title : publicListingLabel(bPlain),
            slug: business.slug,
            description: canViewConfidential ? business.description : maskedListingDescription(bPlain),
            category: business.category,
            sector: business.sector,
            giro: business.giro,
            size: business.size,
            location: business.location,
            financials: business.financials,
            status: business.status,
            isTitleMasked: !canViewConfidential,
            canViewConfidential,
        };

        // Premium users and admins can always view confidential listing details.
        if (canViewConfidential) {
            response.confidentialData = business.confidentialData;
        }
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update business status (admin only)
// @route   PUT /api/business/:id/status
// @access  Private (admin)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body; // accepted, sold, cancelled
        const allowedStatuses = ['accepted', 'sold', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        const business = await Business.findById(req.params.id);
        if (!business) return res.status(404).json({ message: 'Business not found' });

        business.status = status;

        // If the listing is sold/cancelled, stop recurring Stripe billing.
        if ((status === 'sold' || status === 'cancelled') && business.stripeListingSubscriptionId) {
            try {
                const stripe = getStripe();
                await stripe.subscriptions.cancel(business.stripeListingSubscriptionId);
            } catch (error) {
                console.error('Stripe subscription cancel error:', error?.message || error);
            }
            business.isListingPaid = false;
            business.listingSubscriptionStatus = 'canceled';
        }

        await business.save();
        res.json(business);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark listing as paid (seller action)
// @route   PUT /api/business/:id/paylisting
// @access  Private (seller)
exports.payListing = async (req, res) => {
    try {
        return res.status(400).json({
            message: 'Deprecated endpoint. Use /api/billing/checkout/seller-listing/:businessId',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Seller cancels own listing and recurring billing
// @route   PUT /api/business/:id/cancel
// @access  Private (seller)
exports.cancelOwnListing = async (req, res) => {
    try {
        const business = await Business.findOne({ _id: req.params.id, sellerId: req.user._id });
        if (!business) return res.status(404).json({ message: 'Business not found or not owned' });
        if (business.status === 'sold') {
            return res.status(400).json({ message: 'Sold listings cannot be cancelled' });
        }

        if (business.stripeListingSubscriptionId) {
            try {
                const stripe = getStripe();
                await stripe.subscriptions.cancel(business.stripeListingSubscriptionId);
            } catch (error) {
                console.error('Stripe subscription cancel error:', error?.message || error);
            }
        }

        business.status = 'cancelled';
        business.isListingPaid = false;
        business.listingSubscriptionStatus = 'canceled';
        await business.save();

        res.json(business);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get dashboard businesses (seller gets own, admin gets all)
// @route   GET /api/business/dashboard
// @access  Private (seller/admin)
exports.getDashboardBusinesses = async (req, res) => {
    try {
        let filter = {};
        const role = normalizeRole(req.user?.role);
        if (role === 'seller') {
            filter.sellerId = req.user._id;
        } else if (role === 'buyer') {
            return res.json({
                role: 'buyer',
                businesses: [],
                needsRoleOnboarding: Boolean(req.user.needsRoleOnboarding),
            });
        }
        const businesses = await Business.find(filter).sort({ createdAt: -1 });
        res.json({
            role,
            businesses,
            needsRoleOnboarding: Boolean(req.user.needsRoleOnboarding),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

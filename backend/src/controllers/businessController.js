// src/controllers/businessController.js
const Business = require('../models/Business');
const slugify = require('slugify');

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
        if (sector) filter.sector = sector;
        if (giro) filter.giro = giro;
        if (category) filter.category = category;
        if (size) filter.size = size;
        if (minPrice || maxPrice) {
            filter['financials.askingPrice'] = {};
            if (minPrice) filter['financials.askingPrice'].$gte = Number(minPrice);
            if (maxPrice) filter['financials.askingPrice'].$lte = Number(maxPrice);
        }
        const businesses = await Business.find(filter).select('title slug description category sector giro size location financials status');
        res.json(businesses);
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
        const response = {
            title: business.title,
            slug: business.slug,
            description: business.description,
            category: business.category,
            sector: business.sector,
            giro: business.giro,
            size: business.size,
            location: business.location,
            financials: business.financials,
            status: business.status,
        };

        const canViewConfidential = Boolean(
            req.user && (req.user.isPremium || req.user.role === 'admin')
        );
        response.canViewConfidential = canViewConfidential;

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
        const { status } = req.body; // expected 'published' or 'sold'
        const business = await Business.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!business) return res.status(404).json({ message: 'Business not found' });
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
        const business = await Business.findOne({ _id: req.params.id, sellerId: req.user._id });
        if (!business) return res.status(404).json({ message: 'Business not found or not owned' });
        business.isListingPaid = true;
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
        if (req.user.role === 'seller') {
            filter.sellerId = req.user._id;
        } else if (req.user.role === 'buyer') {
            return res.status(403).json({ message: 'Buyers do not have listings' });
        }
        const businesses = await Business.find(filter).sort({ createdAt: -1 });
        res.json(businesses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const BuyerList = require('../models/BuyerList');
const Business = require('../models/Business');
const { maskListingForViewer } = require('../utils/listingVisibility');

const normalizeName = (name) => String(name || '').trim().slice(0, 120);
const WATCHLIST_BUSINESS_FIELDS = 'title slug description giro category sector location financials status isListingPaid sellerId';

const serializeBusinessForViewer = (businessDoc, user) => {
    if (!businessDoc) return businessDoc;
    const business = maskListingForViewer(businessDoc, user);
    delete business.sellerId;
    return business;
};

const serializeListForViewer = (list, user) => {
    const plain = list?.toObject ? list.toObject() : list;
    if (!plain) return plain;

    return {
        ...plain,
        items: (plain.items || []).map((item) => ({
            ...item,
            business: serializeBusinessForViewer(item.business, user),
        })),
    };
};

exports.listMine = async (req, res) => {
    try {
        const lists = await BuyerList.find({ buyerId: req.user._id })
            .sort({ updatedAt: -1 })
            .lean();
        res.json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createList = async (req, res) => {
    try {
        const name = normalizeName(req.body.name);
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la lista es obligatorio' });
        }
        const list = await BuyerList.create({
            buyerId: req.user._id,
            name,
            items: [],
        });
        res.status(201).json(list);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Ya tienes una lista con ese nombre' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.renameList = async (req, res) => {
    try {
        const name = normalizeName(req.body.name);
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la lista es obligatorio' });
        }
        const list = await BuyerList.findOne({ _id: req.params.id, buyerId: req.user._id });
        if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
        list.name = name;
        await list.save();
        res.json(list);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Ya tienes una lista con ese nombre' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const result = await BuyerList.deleteOne({ _id: req.params.id, buyerId: req.user._id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Lista no encontrada' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addBusiness = async (req, res) => {
    try {
        const { businessId } = req.body;
        if (!businessId) {
            return res.status(400).json({ message: 'businessId requerido' });
        }
        const business = await Business.findOne({ _id: businessId, status: 'published' });
        if (!business) {
            return res.status(404).json({ message: 'Negocio no encontrado o no publicado' });
        }
        const list = await BuyerList.findOne({ _id: req.params.id, buyerId: req.user._id });
        if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
        const exists = list.items.some((i) => String(i.business) === String(businessId));
        if (exists) {
            return res.json(list);
        }
        list.items.push({ business: businessId, addedAt: new Date() });
        await list.save();
        const populated = await BuyerList.findById(list._id).populate('items.business', WATCHLIST_BUSINESS_FIELDS);
        res.json(serializeListForViewer(populated, req.user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const list = await BuyerList.findOne({ _id: req.params.id, buyerId: req.user._id });
        if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
        list.items = list.items.filter((i) => String(i.business) !== String(businessId));
        await list.save();
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOne = async (req, res) => {
    try {
        const list = await BuyerList.findOne({ _id: req.params.id, buyerId: req.user._id })
            .populate('items.business', WATCHLIST_BUSINESS_FIELDS);
        if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
        res.json(serializeListForViewer(list, req.user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

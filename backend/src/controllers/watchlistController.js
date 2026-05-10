const BuyerList = require('../models/BuyerList');
const Business = require('../models/Business');
const { maskListingForUser } = require('../utils/listingMask');

const normalizeName = (name) => String(name || '').trim().slice(0, 120);

const WATCHLIST_BUSINESS_FIELDS = 'title slug description giro category sector size location financials status isListingPaid sellerId';

const maskPopulatedBusinesses = (list, user) => {
    if (!list) return list;
    return {
        ...list,
        items: (list.items || []).map((item) => {
            const isPopulatedBusiness =
                item.business &&
                typeof item.business === 'object' &&
                (Object.prototype.hasOwnProperty.call(item.business, 'title') ||
                    Object.prototype.hasOwnProperty.call(item.business, 'slug'));
            const business = isPopulatedBusiness
                ? maskListingForUser(item.business, user)
                : item.business;
            return { ...item, business };
        }),
    };
};

const findPopulatedList = async (listId, user) => {
    const list = await BuyerList.findById(listId)
        .populate('items.business', WATCHLIST_BUSINESS_FIELDS)
        .lean();
    return maskPopulatedBusinesses(list, user);
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
            const populated = await findPopulatedList(list._id, req.user);
            return res.json(populated);
        }
        list.items.push({ business: businessId, addedAt: new Date() });
        await list.save();
        const populated = await findPopulatedList(list._id, req.user);
        res.json(populated);
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
            .populate('items.business', WATCHLIST_BUSINESS_FIELDS)
            .lean();
        if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
        res.json(maskPopulatedBusinesses(list, req.user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

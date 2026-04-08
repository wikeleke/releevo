const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Business = require('../models/Business');

const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return '';
    return rawRole.trim().toLowerCase();
};

const preview = (text, max = 140) => {
    const t = String(text || '').trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max)}…`;
};

exports.listConversations = async (req, res) => {
    try {
        const role = normalizeRole(req.user.role);
        let filter = {};
        if (role === 'seller') {
            filter.seller = req.user._id;
        } else if (role === 'buyer') {
            filter.buyer = req.user._id;
        } else if (role === 'admin') {
            filter = { $or: [{ buyer: req.user._id }, { seller: req.user._id }] };
        } else {
            return res.json([]);
        }

        const conversations = await Conversation.find(filter)
            .sort({ lastMessageAt: -1 })
            .populate('business', 'title slug status')
            .populate('buyer', 'email')
            .populate('seller', 'email')
            .lean();

        const uid = String(req.user._id);
        const asParticipant = conversations.map((c) => {
            const isSeller = String(c.seller?._id || c.seller) === uid;
            return {
                ...c,
                unreadCount: isSeller ? c.sellerUnread : c.buyerUnread,
                peerLabel: isSeller
                    ? (c.buyer?.email || 'Comprador')
                    : (c.seller?.email || 'Vendedor'),
            };
        });

        res.json(asParticipant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.openOrCreate = async (req, res) => {
    try {
        const { businessId } = req.body;
        if (!businessId) {
            return res.status(400).json({ message: 'businessId requerido' });
        }
        const role = normalizeRole(req.user.role);
        if (role !== 'buyer' && role !== 'admin') {
            return res.status(403).json({ message: 'Solo compradores pueden iniciar conversaciones' });
        }
        if (!req.user.isPremium && role !== 'admin') {
            return res.status(403).json({ message: 'Membresía premium requerida para contactar vendedores' });
        }

        const business = await Business.findById(businessId);
        if (!business || business.status !== 'published') {
            return res.status(404).json({ message: 'Negocio no encontrado o no publicado' });
        }
        const sellerId = business.sellerId;
        if (String(sellerId) === String(req.user._id)) {
            return res.status(400).json({ message: 'No puedes chatear contigo mismo' });
        }

        let conv = await Conversation.findOne({ business: businessId, buyer: req.user._id });
        let created = false;
        if (!conv) {
            conv = await Conversation.create({
                business: businessId,
                buyer: req.user._id,
                seller: sellerId,
                lastMessageAt: new Date(),
                lastMessagePreview: '',
                buyerUnread: 0,
                sellerUnread: 0,
            });
            created = true;
        }

        const populated = await Conversation.findById(conv._id)
            .populate('business', 'title slug status')
            .populate('buyer', 'email')
            .populate('seller', 'email');

        res.status(created ? 201 : 200).json(populated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const conv = await Conversation.findById(req.params.id)
            .populate('business', 'title slug')
            .populate('buyer', 'email')
            .populate('seller', 'email');
        if (!conv) return res.status(404).json({ message: 'Conversación no encontrada' });

        const isBuyer = String(conv.buyer._id || conv.buyer) === String(req.user._id);
        const isSeller = String(conv.seller._id || conv.seller) === String(req.user._id);

        if (!isBuyer && !isSeller) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        if (isBuyer) {
            conv.buyerUnread = 0;
        } else if (isSeller) {
            conv.sellerUnread = 0;
        }
        await conv.save();

        const messagesRaw = await Message.find({ conversation: conv._id })
            .sort({ createdAt: 1 })
            .populate('sender', 'email role')
            .lean();

        const messages = messagesRaw.map((m) => ({
            ...m,
            fromMe: String(m.sender?._id || m.sender) === String(req.user._id),
        }));

        const convObj = conv.toObject ? conv.toObject() : conv;
        const peerLabel = isSeller ? (convObj.buyer?.email || 'Comprador') : (convObj.seller?.email || 'Vendedor');

        res.json({
            conversation: { ...convObj, peerLabel },
            messages,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const messageBody = String(req.body.body || '').trim();
        if (!messageBody) {
            return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
        }
        if (messageBody.length > 8000) {
            return res.status(400).json({ message: 'Mensaje demasiado largo' });
        }

        const conv = await Conversation.findById(req.params.id);
        if (!conv) return res.status(404).json({ message: 'Conversación no encontrada' });

        const role = normalizeRole(req.user.role);
        const isBuyer = String(conv.buyer) === String(req.user._id);
        const isSeller = String(conv.seller) === String(req.user._id);

        if (!isBuyer && !isSeller) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        if (isBuyer && !req.user.isPremium && role !== 'admin') {
            return res.status(403).json({ message: 'Membresía premium requerida para enviar mensajes' });
        }

        const msg = await Message.create({
            conversation: conv._id,
            sender: req.user._id,
            body: messageBody,
        });

        conv.lastMessageAt = new Date();
        conv.lastMessagePreview = preview(messageBody);
        if (isBuyer) {
            conv.sellerUnread = (conv.sellerUnread || 0) + 1;
        } else if (isSeller) {
            conv.buyerUnread = (conv.buyerUnread || 0) + 1;
        }
        await conv.save();

        const populated = await Message.findById(msg._id).populate('sender', 'email role').lean();
        res.status(201).json({
            ...populated,
            fromMe: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unreadTotal = async (req, res) => {
    try {
        const role = normalizeRole(req.user.role);
        const uid = String(req.user._id);

        if (role === 'seller') {
            const agg = await Conversation.aggregate([
                { $match: { seller: req.user._id } },
                { $group: { _id: null, total: { $sum: '$sellerUnread' } } },
            ]);
            return res.json({ total: agg[0]?.total || 0 });
        }
        if (role === 'buyer') {
            const agg = await Conversation.aggregate([
                { $match: { buyer: req.user._id } },
                { $group: { _id: null, total: { $sum: '$buyerUnread' } } },
            ]);
            return res.json({ total: agg[0]?.total || 0 });
        }
        if (role === 'admin') {
            const convs = await Conversation.find({
                $or: [{ buyer: req.user._id }, { seller: req.user._id }],
            }).lean();
            let total = 0;
            convs.forEach((c) => {
                if (String(c.buyer) === uid) total += c.buyerUnread || 0;
                else total += c.sellerUnread || 0;
            });
            return res.json({ total });
        }
        res.json({ total: 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

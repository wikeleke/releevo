const { publicListingLabel, maskedListingDescription } = require('./listingMask');

const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return '';
    return rawRole.trim().toLowerCase();
};

const getId = (value) => value?._id || value;

const canSeeListingIdentity = (user, business) => {
    if (!user || !business) return false;
    const role = normalizeRole(user.role);
    if (role === 'admin') return true;
    if (user.isPremium) return true;
    const sellerId = getId(business.sellerId);
    return Boolean(sellerId && String(sellerId) === String(user._id));
};

const toPlainObject = (doc) => {
    if (!doc) return doc;
    if (typeof doc.toObject === 'function') return doc.toObject();
    return { ...doc };
};

const publicListingSlug = (business) => {
    const id = getId(business?._id);
    return id ? String(id) : business?.slug;
};

const maskListingForViewer = (business, user) => {
    const plain = toPlainObject(business);
    if (!plain) return plain;

    if (canSeeListingIdentity(user, plain)) {
        return plain;
    }

    return {
        ...plain,
        title: publicListingLabel(plain),
        slug: publicListingSlug(plain),
        description: maskedListingDescription(plain),
        isTitleMasked: true,
    };
};

module.exports = {
    canSeeListingIdentity,
    maskListingForViewer,
    normalizeRole,
};

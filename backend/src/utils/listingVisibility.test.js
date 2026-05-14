const test = require('node:test');
const assert = require('node:assert/strict');
const { maskListingForViewer } = require('./listingVisibility');

const baseBusiness = {
    _id: '64b64c0f9f1f1f1f1f1f1f1f',
    title: 'Acme Confidential Bakery',
    slug: 'acme-confidential-bakery',
    description: 'Real seller-written description',
    category: 'Food & Beverage',
    sector: 'Restaurants',
    giro: 'Bakery',
    size: 'Small',
    location: { city: 'Madrid', state: 'Madrid' },
    financials: { askingPrice: 250000 },
    sellerId: 'seller-1',
};

test('masks listing identity and slug for viewers without access', () => {
    const masked = maskListingForViewer(baseBusiness, { _id: 'buyer-1', role: 'buyer', isPremium: false });

    assert.equal(masked.title, 'Bakery · Madrid');
    assert.equal(masked.slug, baseBusiness._id);
    assert.notEqual(masked.description, baseBusiness.description);
    assert.equal(masked.isTitleMasked, true);
});

test('preserves listing identity for premium buyers, admins, and owners', () => {
    const premium = maskListingForViewer(baseBusiness, { _id: 'buyer-1', role: 'buyer', isPremium: true });
    const admin = maskListingForViewer(baseBusiness, { _id: 'admin-1', role: 'admin', isPremium: false });
    const owner = maskListingForViewer(baseBusiness, { _id: 'seller-1', role: 'seller', isPremium: false });

    for (const visible of [premium, admin, owner]) {
        assert.equal(visible.title, baseBusiness.title);
        assert.equal(visible.slug, baseBusiness.slug);
        assert.equal(visible.description, baseBusiness.description);
        assert.equal(visible.isTitleMasked, undefined);
    }
});

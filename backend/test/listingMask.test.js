const assert = require('node:assert/strict');
const test = require('node:test');

const { maskListingForUser } = require('../src/utils/listingMask');

const listing = {
  _id: 'listing-123',
  title: 'Acme Industrial SA',
  slug: 'acme-industrial-sa',
  description: 'Descripcion comercial sensible',
  category: 'Manufacturing',
  sector: 'Industria',
  giro: 'Metalurgia',
  size: 'Medium',
  location: { city: 'Monterrey', state: 'NL' },
  financials: { askingPrice: 1000000 },
  status: 'published',
  sellerId: 'seller-123',
};

test('enmascara identidad para compradores no premium', () => {
  const masked = maskListingForUser(listing, {
    _id: 'buyer-123',
    role: 'buyer',
    isPremium: false,
  });

  assert.equal(masked.title, 'Metalurgia · Monterrey');
  assert.equal(masked.slug, 'listing-123');
  assert.equal(masked.sellerId, undefined);
  assert.equal(masked.isTitleMasked, true);
  assert.notEqual(masked.description, listing.description);
});

test('conserva identidad para admin, premium y propietario', () => {
  assert.equal(maskListingForUser(listing, { _id: 'admin-1', role: 'admin' }).slug, listing.slug);
  assert.equal(
    maskListingForUser(listing, { _id: 'buyer-1', role: 'buyer', isPremium: true }).title,
    listing.title
  );
  assert.equal(
    maskListingForUser(listing, { _id: 'seller-123', role: 'seller', isPremium: false }).sellerId,
    listing.sellerId
  );
});

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  premiumFromClerkWebhookUser,
  roleFromClerkSdkUser,
  roleFromClerkWebhookUser,
} = require('../src/utils/clerkRole');

test('ignora roles procedentes de unsafeMetadata de Clerk SDK', () => {
  assert.equal(
    roleFromClerkSdkUser({ unsafeMetadata: { role: 'admin' } }),
    null
  );
});

test('acepta roles procedentes de metadata controlada por servidor', () => {
  assert.equal(
    roleFromClerkSdkUser({ privateMetadata: { role: 'seller' } }),
    'seller'
  );
  assert.equal(
    roleFromClerkWebhookUser({ public_metadata: { role: 'admin' } }),
    'admin'
  );
});

test('ignora premium procedente de unsafe_metadata en webhooks', () => {
  assert.equal(
    premiumFromClerkWebhookUser({ unsafe_metadata: { isPremium: true } }),
    null
  );
});

test('acepta premium procedente de metadata controlada por servidor', () => {
  assert.equal(
    premiumFromClerkWebhookUser({ private_metadata: { isPremium: 'true' } }),
    true
  );
});

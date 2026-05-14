const test = require('node:test');
const assert = require('node:assert/strict');
const {
    roleFromClerkSdkUser,
    roleFromClerkWebhookUser,
} = require('./clerkRole');

test('ignores client-writable unsafeMetadata when resolving SDK roles', () => {
    assert.equal(roleFromClerkSdkUser({ unsafeMetadata: { role: 'admin' } }), null);
    assert.equal(roleFromClerkSdkUser({ publicMetadata: { role: 'seller' } }), 'seller');
    assert.equal(roleFromClerkSdkUser({ privateMetadata: { role: 'admin' } }), 'admin');
});

test('ignores client-writable unsafe_metadata when resolving webhook roles', () => {
    assert.equal(roleFromClerkWebhookUser({ unsafe_metadata: { role: 'admin' } }), null);
    assert.equal(roleFromClerkWebhookUser({ public_metadata: { role: 'buyer' } }), 'buyer');
    assert.equal(roleFromClerkWebhookUser({ private_metadata: { role: 'seller' } }), 'seller');
});

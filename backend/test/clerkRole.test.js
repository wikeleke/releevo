const test = require('node:test');
const assert = require('node:assert/strict');

const {
    roleFromClerkSdkUser,
    roleFromClerkWebhookUser,
    shouldUpgradeMongoRole,
} = require('../src/utils/clerkRole');

test('ignores user-writable unsafeMetadata roles from Clerk SDK users', () => {
    assert.equal(
        roleFromClerkSdkUser({
            unsafeMetadata: { role: 'admin' },
        }),
        null
    );
});

test('ignores user-writable unsafe_metadata roles from Clerk webhooks', () => {
    assert.equal(
        roleFromClerkWebhookUser({
            unsafe_metadata: { role: 'admin' },
        }),
        null
    );
});

test('still accepts server-controlled Clerk metadata roles', () => {
    assert.equal(
        roleFromClerkSdkUser({
            publicMetadata: { role: 'seller' },
        }),
        'seller'
    );
    assert.equal(
        roleFromClerkWebhookUser({
            public_metadata: { role: 'seller' },
        }),
        'seller'
    );
});

test('keeps admin upgrades possible only from trusted role sources', () => {
    assert.equal(shouldUpgradeMongoRole('buyer', 'admin'), true);
});

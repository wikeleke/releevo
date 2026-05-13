const test = require('node:test');
const assert = require('node:assert/strict');

const {
    accessFromClerkWebhookUser,
    roleFromClerkSdkUser,
    roleFromClerkWebhookUser,
    shouldUpgradeMongoRole,
} = require('../src/utils/clerkRole');

test('ignores Clerk unsafe metadata for roles and premium flags', () => {
    assert.equal(
        roleFromClerkSdkUser({
            unsafeMetadata: { role: 'admin' },
        }),
        null
    );

    assert.equal(
        roleFromClerkWebhookUser({
            unsafe_metadata: { role: 'admin' },
        }),
        null
    );

    assert.deepEqual(
        accessFromClerkWebhookUser({
            unsafe_metadata: { role: 'admin', isPremium: true },
            unsafeMetadata: { role: 'seller', isPremium: 'true' },
        }),
        { role: null, isPremium: null }
    );
});

test('accepts trusted Clerk metadata for role and premium sync', () => {
    assert.equal(
        roleFromClerkSdkUser({
            publicMetadata: { role: 'seller' },
        }),
        'seller'
    );

    assert.equal(
        roleFromClerkWebhookUser({
            private_metadata: { role: 'admin' },
        }),
        'admin'
    );

    assert.deepEqual(
        accessFromClerkWebhookUser({
            public_metadata: { role: 'seller' },
            private_metadata: { isPremium: 'true' },
        }),
        { role: 'seller', isPremium: true }
    );
});

test('keeps role upgrade rules explicit', () => {
    assert.equal(shouldUpgradeMongoRole('buyer', 'seller'), true);
    assert.equal(shouldUpgradeMongoRole('buyer', 'admin'), true);
    assert.equal(shouldUpgradeMongoRole('seller', 'admin'), true);
    assert.equal(shouldUpgradeMongoRole('admin', 'buyer'), false);
    assert.equal(shouldUpgradeMongoRole('seller', 'buyer'), false);
});

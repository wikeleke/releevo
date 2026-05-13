const test = require('node:test');
const assert = require('node:assert/strict');

const { shouldExposePasswordResetLink } = require('../src/utils/passwordReset');

test('does not expose password reset links unless explicitly enabled', () => {
    assert.equal(shouldExposePasswordResetLink({}), false);
    assert.equal(shouldExposePasswordResetLink({ NODE_ENV: 'development' }), false);
    assert.equal(shouldExposePasswordResetLink({ EXPOSE_PASSWORD_RESET_LINK: 'false' }), false);
});

test('allows password reset links for explicit local demo opt-in', () => {
    assert.equal(shouldExposePasswordResetLink({ EXPOSE_PASSWORD_RESET_LINK: 'true' }), true);
});

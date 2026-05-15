const assert = require('node:assert/strict');
const test = require('node:test');

const router = require('../src/routes/business');
const protect = require('../src/middleware/auth');

test('business detail route uses optional auth for public listing access', () => {
    const slugRoute = router.stack.find((layer) => (
        layer.route?.path === '/:slug' && layer.route?.methods?.get
    ));

    assert.ok(slugRoute, 'expected GET /:slug route to be registered');
    assert.equal(slugRoute.route.stack[0].handle, protect.optionalAttachUser);
});

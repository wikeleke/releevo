const assert = require('node:assert/strict');
const test = require('node:test');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const User = require('../src/models/User');
const { signup } = require('../src/controllers/authController');

const originalFindOne = User.findOne;
const originalSave = User.prototype.save;

const createResponse = () => ({
    statusCode: 200,
    body: undefined,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(payload) {
        this.body = payload;
        return this;
    },
});

test.afterEach(() => {
    User.findOne = originalFindOne;
    User.prototype.save = originalSave;
});

test('signup rejects admin role from public requests', async () => {
    let saveCalled = false;
    User.findOne = async () => null;
    User.prototype.save = async function saveStub() {
        saveCalled = true;
    };

    const res = createResponse();
    await signup({
        body: {
            email: 'attacker@example.com',
            password: 'password123',
            role: 'admin',
        },
    }, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, 'Invalid role for public signup');
    assert.equal(saveCalled, false);
});

test('signup normalizes allowed public roles before persistence', async () => {
    let savedRole;
    User.findOne = async () => null;
    User.prototype.save = async function saveStub() {
        savedRole = this.role;
    };

    const res = createResponse();
    await signup({
        body: {
            email: 'seller@example.com',
            password: 'password123',
            role: ' SELLER ',
        },
    }, res);

    assert.equal(res.statusCode, 201);
    assert.equal(savedRole, 'seller');
    assert.equal(res.body.user.role, 'seller');
});

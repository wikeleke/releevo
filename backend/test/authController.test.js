const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

test('public signup never creates admin users from request body role', async () => {
    const modelPath = require.resolve('../src/models/User');
    const controllerPath = require.resolve('../src/controllers/authController');
    delete require.cache[modelPath];
    delete require.cache[controllerPath];

    const savedUsers = [];
    function MockUser(data) {
        Object.assign(this, {
            _id: 'user-id',
            isPremium: false,
            ...data,
        });
    }
    MockUser.findOne = async () => null;
    MockUser.prototype.save = async function save() {
        savedUsers.push(this);
    };

    require.cache[modelPath] = {
        id: modelPath,
        filename: modelPath,
        loaded: true,
        exports: MockUser,
    };

    const { signup } = require('../src/controllers/authController');
    const response = {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };

    await signup({
        body: {
            email: 'attacker@example.com',
            password: 'password123',
            role: 'admin',
        },
    }, response);

    assert.equal(response.statusCode, 201);
    assert.equal(savedUsers[0].role, 'buyer');
    assert.equal(response.body.user.role, 'buyer');
});

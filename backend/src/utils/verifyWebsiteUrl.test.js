const assert = require('node:assert/strict');
const test = require('node:test');
const dns = require('dns').promises;
const { verifyWebsiteUrl } = require('./verifyWebsiteUrl');

const originalLookup = dns.lookup;
const originalFetch = global.fetch;

function response(status, headers = {}) {
    return {
        status,
        headers: {
            get(name) {
                return headers[String(name).toLowerCase()] || null;
            },
        },
    };
}

test.afterEach(() => {
    dns.lookup = originalLookup;
    global.fetch = originalFetch;
});

test('rejects redirects to blocked private destinations before fetching them', async () => {
    const fetchedUrls = [];

    dns.lookup = async (host) => {
        assert.equal(host, 'example.com');
        return [{ address: '93.184.216.34', family: 4 }];
    };

    global.fetch = async (url) => {
        fetchedUrls.push(url);
        return response(302, { location: 'http://127.0.0.1/admin' });
    };

    const result = await verifyWebsiteUrl('https://example.com');

    assert.deepEqual(result, { ok: false, message: 'Este destino no está permitido' });
    assert.deepEqual(fetchedUrls, ['https://example.com/']);
});

test('follows safe redirects manually', async () => {
    const fetchedUrls = [];

    dns.lookup = async (host) => {
        assert.ok(['example.com', 'www.example.com'].includes(host));
        return [{ address: '93.184.216.34', family: 4 }];
    };

    global.fetch = async (url) => {
        fetchedUrls.push(url);
        if (url === 'https://example.com/') {
            return response(301, { location: 'https://www.example.com/' });
        }
        return response(200);
    };

    const result = await verifyWebsiteUrl('example.com');

    assert.deepEqual(result, { ok: true, url: 'https://example.com/' });
    assert.deepEqual(fetchedUrls, ['https://example.com/', 'https://www.example.com/']);
});

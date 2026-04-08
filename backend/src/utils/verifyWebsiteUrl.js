const dns = require('dns').promises;
const net = require('net');

const BLOCKED_HOSTNAMES = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    'metadata.google.internal',
    'metadata',
]);

function ipv4ToInt(ip) {
    const p = ip.split('.').map(Number);
    if (p.length !== 4 || p.some((x) => Number.isNaN(x))) return null;
    return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
}

function isPrivateOrReservedV4(ip) {
    const n = ipv4ToInt(ip);
    if (n === null) return true;
    const a = (n >>> 24) & 0xff;
    const b = (n >>> 16) & 0xff;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    return false;
}

function isBlockedV6(ip) {
    const u = ip.toLowerCase();
    return (
        u === '::1'
        || u.startsWith('fe80:')
        || u.startsWith('fc00:')
        || u.startsWith('fd00:')
        || u.startsWith('::ffff:127.')
    );
}

/**
 * Normaliza URL y comrueba host seguro (no SSRF obvio). Resuelve DNS y bloquea rangos privados.
 * @returns {{ ok: boolean, url?: string, message?: string }}
 */
exports.verifyWebsiteUrl = async (raw) => {
    if (typeof raw !== 'string' || !raw.trim()) {
        return { ok: false, message: 'Indica una URL o dominio' };
    }

    let url;
    const trimmed = raw.trim();
    try {
        url = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    } catch {
        return { ok: false, message: 'URL inválida' };
    }

    if (url.username || url.password) {
        return { ok: false, message: 'La URL no debe incluir usuario/contraseña' };
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return { ok: false, message: 'Solo se permiten http o https' };
    }

    const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
    if (!host || BLOCKED_HOSTNAMES.has(host)) {
        return { ok: false, message: 'Este destino no está permitido' };
    }

    if (net.isIP(host)) {
        if (net.isIPv4(host) && isPrivateOrReservedV4(host)) {
            return { ok: false, message: 'Este destino no está permitido' };
        }
        if (net.isIPv6(host) && isBlockedV6(host)) {
            return { ok: false, message: 'Este destino no está permitido' };
        }
    } else {
        try {
            const results = await dns.lookup(host, { all: true });
            for (const r of results) {
                if (r.family === 4 && isPrivateOrReservedV4(r.address)) {
                    return { ok: false, message: 'Este destino no está permitido' };
                }
                if (r.family === 6 && isBlockedV6(r.address)) {
                    return { ok: false, message: 'Este destino no está permitido' };
                }
            }
        } catch {
            return { ok: false, message: 'No se pudo resolver el dominio' };
        }
    }

    const finalUrl = url.toString();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    try {
        let res = await fetch(finalUrl, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Releevo-Onboarding/1.0 (+https://releevo.com)',
                Accept: 'text/html,*/*;q=0.8',
            },
        });

        /* Algunos sitios cortan GET con 405; probamos HEAD */
        if (res.status === 405) {
            res = await fetch(finalUrl, {
                method: 'HEAD',
                redirect: 'follow',
                signal: controller.signal,
                headers: { 'User-Agent': 'Releevo-Onboarding/1.0' },
            });
        }

        if (res.status >= 500) {
            return { ok: false, message: 'El sitio no respondió correctamente' };
        }

        return { ok: true, url: finalUrl };
    } catch (e) {
        const msg = e?.name === 'AbortError' ? 'Tiempo de espera agotado' : 'No se pudo conectar al sitio';
        return { ok: false, message: msg };
    } finally {
        clearTimeout(timer);
    }
};

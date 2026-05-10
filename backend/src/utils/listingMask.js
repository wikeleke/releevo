/**
 * Etiqueta pública sin revelar el nombre comercial del listado (giro / categoría + ciudad).
 */
exports.publicListingLabel = (b) => {
    const giro = String(b.giro || '').trim();
    const category = String(b.category || '').trim();
    const sector = String(b.sector || '').trim();
    const city = String(b.location?.city || '').trim();
    const label = giro || category || sector || 'Negocio';
    return city ? `${label} · ${city}` : label;
};

const sizeLabelEs = (size) => {
    const v = String(size || '').toLowerCase();
    if (v === 'small') return 'Escala operativa compacta';
    if (v === 'medium') return 'Escala operativa media';
    if (v === 'large') return 'Escala operativa amplia';
    return '';
};

/**
 * Resumen breve para listados sin acceso a la descripción completa (solo atributos públicos).
 * No debe invitar a “activar membresía”; es texto neutro tipo ficha pública.
 */
exports.maskedListingDescription = (b) => {
    const giro = String(b.giro || '').trim();
    const sector = String(b.sector || '').trim();
    const category = String(b.category || '').trim();
    const main = giro || sector || category || 'operación comercial';
    const extra = [sector, category, giro].find((x) => x && x !== main) || '';
    const city = String(b.location?.city || '').trim();
    const state = String(b.location?.state || '').trim();
    const loc = [city, state].filter(Boolean).join(', ');
    const scale = sizeLabelEs(b.size);

    let text = `Oportunidad en ${main}`;
    if (extra) text += `, relacionada con ${extra}`;
    text += '.';
    if (loc) text += ` Ubicación: ${loc}.`;
    if (scale) text += ` ${scale}.`;
    return text.replace(/\s+/g, ' ').trim();
};

const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return '';
    return rawRole.trim().toLowerCase();
};

const sellerIdFrom = (business) => {
    const seller = business?.sellerId;
    return seller?._id || seller || null;
};

exports.canSeeListingIdentity = (user, business) => {
    if (!user || !business) return false;
    const role = normalizeRole(user.role);
    if (role === 'admin') return true;
    if (user.isPremium) return true;

    const sellerId = sellerIdFrom(business);
    return Boolean(sellerId && user._id && String(sellerId) === String(user._id));
};

exports.maskListingForUser = (business, user) => {
    const source = business?.toObject ? business.toObject() : { ...(business || {}) };
    if (exports.canSeeListingIdentity(user, source)) {
        return source;
    }

    const { sellerId, ...safe } = source;
    return {
        ...safe,
        slug: String(source._id || ''),
        title: exports.publicListingLabel(source),
        description: exports.maskedListingDescription(source),
        isTitleMasked: true,
    };
};

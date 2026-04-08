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

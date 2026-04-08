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

exports.maskedListingDescription = (b) => {
    const part = String((b.giro || b.category || b.sector || 'este sector').trim());
    return `Oportunidad en ${part}. Activa tu membresía para ver el nombre del negocio, la descripción completa y los datos de contacto.`;
};

/**
 * Convierte el valor del filtro "sector" del mercado (mismo vocabulario que CreateListing.category)
 * en una condición Mongo que coincide con category y/o sector reales en la BD.
 */
const SECTOR_GROUPS = {
    Retail: ['Retail', 'E-commerce', 'Franquicias'],
    'Food & Beverage': ['Restaurantes', 'Food & Beverage'],
    Technology: ['Tecnología', 'Technology'],
    Services: ['Servicios', 'Services', 'Hotelería', 'Educación', 'Automotriz'],
    Manufacturing: ['Manufacturing', 'Manufactura'],
    Healthcare: ['Salud y Bienestar', 'Healthcare', 'Salud'],
    'Real Estate': ['Real Estate', 'Inmobiliaria', 'Bienes raices', 'Bienes raíces'],
};

/**
 * @param {string} sectorParam - valor del query ?sector=
 * @returns {object|null} - fragmento de query Mongo; null si vacío
 */
exports.resolveMarketSectorCondition = (sectorParam) => {
    const s = String(sectorParam || '').trim();
    if (!s) return null;

    if (Object.prototype.hasOwnProperty.call(SECTOR_GROUPS, s)) {
        const categories = SECTOR_GROUPS[s];
        if (s === 'Manufacturing') {
            return {
                $or: [
                    { category: { $in: categories } },
                    {
                        category: 'Servicios',
                        sector: {
                            $regex: 'Construcci|Imprenta|Impresión|fabricación|manufactura',
                            $options: 'i',
                        },
                    },
                ],
            };
        }
        return { category: { $in: categories } };
    }

    return {
        $or: [{ sector: s }, { category: s }, { giro: s }],
    };
};

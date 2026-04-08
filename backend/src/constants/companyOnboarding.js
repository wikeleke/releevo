/** Valores permitidos para sellerCompanyProfile.companyType */
exports.COMPANY_TYPES = [
    { value: 'saas', label: 'Producto de software / SaaS' },
    { value: 'ecommerce', label: 'Comercio en línea / e‑commerce' },
    { value: 'retail', label: 'Tienda física / Retail' },
    { value: 'servicios', label: 'Servicios profesionales' },
    { value: 'manufactura', label: 'Manufactura / Industrial' },
    { value: 'alimentos', label: 'Alimentos y bebidas' },
    { value: 'construccion', label: 'Construcción' },
    { value: 'salud', label: 'Salud y bienestar' },
    { value: 'educacion', label: 'Educación y capacitación' },
    { value: 'logistica', label: 'Logística y transporte' },
    { value: 'hospitalidad', label: 'Hospitalidad y turismo' },
    { value: 'agro', label: 'Agro y sector primario' },
    { value: 'energia', label: 'Energía y utilities' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'otro', label: 'Otro / mixto' },
];

exports.COMPANY_TYPE_VALUES = new Set(exports.COMPANY_TYPES.map((t) => t.value));

exports.ONBOARDING_EXIT_REASONS = ['not_ready', 'elsewhere', 'privacy', 'be_back'];

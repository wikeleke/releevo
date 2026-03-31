// seed.js - Populate the database with test data
const mongoose = require('mongoose');
const slugify = require('slugify');
require('dotenv').config();
const User = require('./src/models/User');
const Business = require('./src/models/Business');

// ── Helpers ──
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randBetween = (min, max) => Math.round((Math.random() * (max - min) + min) / 1000) * 1000;

// ── 10 Users ──
const users = [
  { email: 'admin@releevo.com', password: 'Rv!A9kLm#27Qp', role: 'admin', isPremium: true },
  { email: 'superadmin@releevo.com', password: 'Rv!S8dTy$64Mn', role: 'admin', isPremium: true },
  { email: 'seller1@releevo.com', password: 'Rv!Se1#Qw73Lp', role: 'seller', isPremium: false },
  { email: 'seller2@releevo.com', password: 'Rv!Se2$Zx58Kt', role: 'seller', isPremium: true },
  { email: 'seller3@releevo.com', password: 'Rv!Se3%Vb91Hr', role: 'seller', isPremium: false },
  { email: 'seller4@releevo.com', password: 'Rv!Se4&Nm46Dj', role: 'seller', isPremium: true },
  { email: 'seller5@releevo.com', password: 'Rv!Se5*Gt82Cx', role: 'seller', isPremium: false },
  { email: 'buyer1@releevo.com', password: 'Rv!By1#Lq74Wp', role: 'buyer', isPremium: false },
  { email: 'buyer2@releevo.com', password: 'Rv!By2$Fr69Zd', role: 'buyer', isPremium: true },
  { email: 'buyer3@releevo.com', password: 'Rv!By3%Hp53Xs', role: 'buyer', isPremium: false },
];

const sellerEmails = users.filter(u => u.role === 'seller').map(u => u.email);

// ── Data pools for random generation ──
const locations = [
  { city: 'Ciudad de México', state: 'CDMX' },
  { city: 'Guadalajara', state: 'Jalisco' },
  { city: 'Monterrey', state: 'Nuevo León' },
  { city: 'Puebla', state: 'Puebla' },
  { city: 'Querétaro', state: 'Querétaro' },
  { city: 'Mérida', state: 'Yucatán' },
  { city: 'León', state: 'Guanajuato' },
  { city: 'San Miguel de Allende', state: 'Guanajuato' },
  { city: 'Cancún', state: 'Quintana Roo' },
  { city: 'Playa del Carmen', state: 'Quintana Roo' },
  { city: 'Tijuana', state: 'Baja California' },
  { city: 'Oaxaca', state: 'Oaxaca' },
  { city: 'Aguascalientes', state: 'Aguascalientes' },
  { city: 'Zapopan', state: 'Jalisco' },
  { city: 'Toluca', state: 'Estado de México' },
  { city: 'Chihuahua', state: 'Chihuahua' },
  { city: 'Saltillo', state: 'Coahuila' },
  { city: 'Morelia', state: 'Michoacán' },
  { city: 'Villahermosa', state: 'Tabasco' },
  { city: 'Tuxtla Gutiérrez', state: 'Chiapas' },
];

const sizes = ['Small', 'Medium', 'Large'];

// Each template: [title, description, category, sector, giro, priceRange, revenueRange]
const templates = [
  ['Restaurante {N}', 'Restaurante de comida mexicana con clientela leal y cocina equipada. Ubicado en zona de alto tráfico.', 'Restaurantes', 'Alimentos y Bebidas', 'Restaurante', [1500000,4000000], [3000000,8000000]],
  ['Cafetería {N}', 'Cafetería de especialidad con tostadora propia, ambiente acogedor y menú de brunch artesanal.', 'Restaurantes', 'Alimentos y Bebidas', 'Cafetería', [800000,2000000], [1500000,4000000]],
  ['Taquería {N}', 'Taquería popular con recetas tradicionales y alto volumen de venta diaria. Excelente ubicación.', 'Restaurantes', 'Alimentos y Bebidas', 'Taquería', [500000,1500000], [2000000,5000000]],
  ['Panadería {N}', 'Panadería artesanal con producción propia, horno industrial y cartera de clientes mayoristas.', 'Restaurantes', 'Alimentos y Bebidas', 'Panadería', [700000,2500000], [1800000,4500000]],
  ['Bar {N}', 'Bar-lounge con licencia de alcohol vigente, terraza y sistema de sonido profesional.', 'Restaurantes', 'Alimentos y Bebidas', 'Bar', [1200000,3500000], [2500000,6000000]],
  ['Gimnasio {N}', 'Gimnasio con equipo moderno, clases grupales y membresías activas. Gran oportunidad de inversión.', 'Salud y Bienestar', 'Deportes y Fitness', 'Gimnasio', [2000000,6000000], [4000000,9000000]],
  ['Clínica Dental {N}', 'Clínica dental equipada con tecnología de punta y base de pacientes establecida.', 'Salud y Bienestar', 'Salud', 'Clínica dental', [2500000,5000000], [4000000,8000000]],
  ['Spa {N}', 'Spa y centro de bienestar con cabinas de masaje, sauna y tratamientos faciales premium.', 'Salud y Bienestar', 'Bienestar', 'Spa', [1000000,3000000], [2000000,5000000]],
  ['Farmacia {N}', 'Farmacia independiente con inventario completo, punto de venta y clientela recurrente.', 'Salud y Bienestar', 'Salud', 'Farmacia', [800000,2500000], [3000000,7000000]],
  ['Tienda de Ropa {N}', 'Boutique de moda con presencia en redes sociales y contratos de arrendamiento vigentes.', 'Retail', 'Moda y Textil', 'Tienda de ropa', [600000,2000000], [2000000,5000000]],
  ['Zapatería {N}', 'Zapatería con marcas nacionales e importadas. Inventario surtido y ubicación en centro comercial.', 'Retail', 'Moda y Textil', 'Zapatería', [500000,1500000], [1500000,4000000]],
  ['Ferretería {N}', 'Ferretería completa con inventario amplio, clientes frecuentes y servicio de entrega a domicilio.', 'Retail', 'Construcción', 'Ferretería', [1500000,4000000], [5000000,12000000]],
  ['Papelería {N}', 'Papelería y centro de copiado con clientela estudiantil constante. Incluye equipo de impresión.', 'Retail', 'Educación', 'Papelería', [300000,900000], [800000,2000000]],
  ['Agencia de Marketing {N}', 'Agencia digital con cartera de clientes recurrentes. Servicios de SEO, SEM y social media.', 'Tecnología', 'Marketing', 'Agencia de marketing', [2000000,5000000], [3000000,7000000]],
  ['Empresa de Software {N}', 'Empresa de desarrollo de software con producto SaaS y contratos enterprise activos.', 'Tecnología', 'Software', 'Desarrollo de software', [5000000,15000000], [6000000,20000000]],
  ['Consultoría IT {N}', 'Consultora de tecnología especializada en transformación digital para PyMEs.', 'Tecnología', 'Consultoría', 'Consultoría IT', [1500000,4000000], [3000000,8000000]],
  ['Lavandería {N}', 'Lavandería automática con modelo semi-pasivo y baja necesidad de personal.', 'Servicios', 'Servicios al Consumidor', 'Lavandería', [800000,2000000], [1500000,3500000]],
  ['Taller Mecánico {N}', 'Taller mecánico con diagnóstico computarizado y herramientas especializadas incluidas.', 'Automotriz', 'Servicios Automotrices', 'Taller mecánico', [1500000,4000000], [3000000,7000000]],
  ['Agencia de Autos {N}', 'Lote de autos seminuevos con inventario de 30+ unidades y financiamiento propio.', 'Automotriz', 'Venta de Vehículos', 'Agencia de autos', [5000000,15000000], [10000000,25000000]],
  ['Autolavado {N}', 'Autolavado con sistema automatizado, aspirado interior y servicio express.', 'Automotriz', 'Servicios Automotrices', 'Autolavado', [600000,1800000], [1200000,3000000]],
  ['E-commerce {N}', 'Tienda en línea con marca propia, logística establecida y envíos a todo México.', 'E-commerce', 'Comercio Electrónico', 'Tienda en línea', [500000,3000000], [2000000,8000000]],
  ['Franquicia {N}', 'Franquicia con derechos territoriales, punto de venta equipado y soporte del franquiciante.', 'Franquicias', 'Franquicias', 'Franquicia', [500000,2000000], [1500000,4000000]],
  ['Hotel Boutique {N}', 'Hotel boutique con 12 habitaciones, decoración artesanal y alta ocupación en temporada.', 'Hotelería', 'Turismo', 'Hotel', [8000000,20000000], [5000000,15000000]],
  ['Escuela de Idiomas {N}', 'Academia de idiomas con programas certificados, aulas equipadas y 200+ alumnos inscritos.', 'Educación', 'Educación', 'Escuela de idiomas', [1000000,3000000], [2000000,5000000]],
  ['Guardería {N}', 'Guardería con permisos vigentes, áreas de juego seguras y personal certificado.', 'Educación', 'Cuidado Infantil', 'Guardería', [1500000,4000000], [2500000,6000000]],
  ['Imprenta {N}', 'Imprenta digital y offset con equipo de última generación y cartera corporativa.', 'Servicios', 'Impresión', 'Imprenta', [2000000,5000000], [4000000,10000000]],
  ['Florería {N}', 'Florería con servicio de diseño floral para eventos, entregas a domicilio y tienda en línea.', 'Retail', 'Comercio', 'Florería', [400000,1200000], [1000000,3000000]],
  ['Veterinaria {N}', 'Clínica veterinaria con quirófano, área de estética canina y venta de alimentos premium.', 'Salud y Bienestar', 'Salud Animal', 'Veterinaria', [1200000,3500000], [2500000,6000000]],
  ['Estética {N}', 'Salón de belleza con estilistas experimentados y servicios de colorimetría y tratamientos capilares.', 'Salud y Bienestar', 'Belleza', 'Estética', [500000,1500000], [1200000,3000000]],
  ['Constructora {N}', 'Empresa constructora con maquinaria propia, equipo de obra y proyectos en cartera.', 'Servicios', 'Construcción', 'Constructora', [10000000,25000000], [15000000,40000000]],
];

const namePool = [
  'El Dorado','La Estrella','San Rafael','Los Arcos','El Portal','La Hacienda','Nuevo Mundo',
  'El Mirador','Monte Real','Vía Magna','Santiago','Horizonte','Del Valle','El Roble',
  'Las Palmas','Sierra Alta','La Cumbre','El Fresno','Vista Hermosa','Río Grande',
  'Chapultepec','La Victoria','San Ángel','Polanco','Reforma','Condesa','Roma Norte',
  'Coyoacán','Santa Fe','Insurgentes','Del Bosque','La Perla','El Faro','Costa Azul',
  'Montecarlo','El Encanto','Terra Nova','Sol Naciente','Bella Vista','Alto Nivel',
  'El Progreso','Nueva Era','Central','Metroplex','Diamante','Platino','Oasis','El Jardín',
  'La Cascada','Premium',
];

const streets = [
  'Av. Reforma','Blvd. López Mateos','Calle Hidalgo','Av. Juárez','Calle Morelos',
  'Av. Insurgentes','Blvd. Independencia','Calle 5 de Mayo','Av. Revolución','Calle Allende',
  'Av. Universidad','Blvd. Costero','Calle Madero','Av. Constitución','Calle Guerrero',
];

const colonias = [
  'Col. Centro','Col. Americana','Col. Del Valle','Col. Roma','Col. Condesa',
  'Col. Polanco','Col. Narvarte','Col. Industrial','Col. Jardines','Col. Santa Fe',
];

// ── Generate 50 businesses ──
function generateBusinesses() {
  const businesses = [];
  // 5 sold, rest split between published and pending
  const statuses = [];
  for (let i = 0; i < 5; i++) statuses.push('sold');
  for (let i = 0; i < 35; i++) statuses.push('published');
  for (let i = 0; i < 10; i++) statuses.push('pending');
  // shuffle
  statuses.sort(() => Math.random() - 0.5);

  const usedNames = new Set();

  for (let i = 0; i < 50; i++) {
    const tpl = templates[i % templates.length];
    let name;
    do {
      name = pick(namePool);
    } while (usedNames.has(`${tpl[0]}-${name}`));
    usedNames.add(`${tpl[0]}-${name}`);

    const title = tpl[0].replace('{N}', name);
    const loc = pick(locations);
    const [minP, maxP] = tpl[5];
    const [minR, maxR] = tpl[6];
    const askingPrice = randBetween(minP, maxP);
    const annualRevenue = randBetween(minR, maxR);
    const profitMargin = 0.15 + Math.random() * 0.2;
    const status = statuses[i];

    businesses.push({
      sellerEmail: pick(sellerEmails),
      title,
      description: tpl[1] + ` Ubicado en ${loc.city}, ${loc.state}.`,
      category: tpl[2],
      sector: tpl[3],
      giro: tpl[4],
      size: pick(sizes),
      location: loc,
      financials: {
        askingPrice,
        annualRevenue,
        annualProfit: Math.round(annualRevenue * profitMargin),
      },
      confidentialData: {
        businessName: `${title} S.A. de C.V.`,
        exactAddress: `${pick(streets)} ${100 + Math.floor(Math.random() * 3000)}, ${pick(colonias)}`,
        contactPhone: `+52 ${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
        contactEmail: `contacto@${slugify(title, { lower: true, strict: true }).slice(0, 15)}.mx`,
        website: Math.random() > 0.3 ? `https://${slugify(title, { lower: true, strict: true }).slice(0, 15)}.mx` : '',
      },
      status,
      isListingPaid: status !== 'pending' ? true : Math.random() > 0.5,
    });
  }
  return businesses;
}

// ── Seed ──
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await User.deleteMany({});
    await Business.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const u of users) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 ${user.email} (${user.role}${user.isPremium ? ', premium' : ''})`);
    }
    const emailToId = Object.fromEntries(createdUsers.map(u => [u.email, u._id]));

    // Create businesses
    const bizData = generateBusinesses();
    for (const biz of bizData) {
      const slug = slugify(biz.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2, 6);
      const business = new Business({ ...biz, slug, sellerId: emailToId[biz.sellerEmail] });
      delete business.sellerEmail;
      await business.save();
      console.log(`🏢 [${biz.status.padEnd(9)}] ${biz.title}`);
    }

    const counts = { published: 0, pending: 0, sold: 0 };
    for (const b of bizData) counts[b.status]++;
    console.log('\n───────────────────────────────────');
    console.log(`✅ Seed complete!`);
    console.log(`   Users:      ${users.length}`);
    console.log(`   Businesses: ${bizData.length} (${counts.published} published, ${counts.pending} pending, ${counts.sold} sold)`);
    console.log('───────────────────────────────────');
    console.log('\n📋 Credentials:');
    console.log('   admin@releevo.com        / Rv!A9kLm#27Qp');
    console.log('   superadmin@releevo.com   / Rv!S8dTy$64Mn');
    console.log('   seller1@releevo.com      / Rv!Se1#Qw73Lp');
    console.log('   seller2@releevo.com      / Rv!Se2$Zx58Kt');
    console.log('   seller3@releevo.com      / Rv!Se3%Vb91Hr');
    console.log('   seller4@releevo.com      / Rv!Se4&Nm46Dj');
    console.log('   seller5@releevo.com      / Rv!Se5*Gt82Cx');
    console.log('   buyer1@releevo.com       / Rv!By1#Lq74Wp');
    console.log('   buyer2@releevo.com       / Rv!By2$Fr69Zd');
    console.log('   buyer3@releevo.com       / Rv!By3%Hp53Xs');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();

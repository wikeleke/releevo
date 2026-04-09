const crypto = require('crypto');
const slugify = require('slugify');
const { clerkClient } = require('@clerk/express');
const Business = require('../models/Business');
const { verifyWebsiteUrl } = require('../utils/verifyWebsiteUrl');
const {
    COMPANY_TYPE_VALUES,
    COMPANY_TYPES,
    ONBOARDING_EXIT_REASONS,
} = require('../constants/companyOnboarding');

const MANAGEABLE_LISTING_SUB_STATUS = ['active', 'trialing', 'past_due'];

async function hasActiveSellerListingSubscription(userId) {
    const rows = await Business.find({ sellerId: userId })
        .select('isListingPaid listingSubscriptionStatus stripeListingSubscriptionId')
        .lean();
    return rows.some((b) => {
        const st = String(b.listingSubscriptionStatus || '').toLowerCase();
        if (st === 'canceled' || st === 'cancelled' || st === 'unpaid' || st === 'incomplete_expired') {
            return false;
        }
        if (MANAGEABLE_LISTING_SUB_STATUS.includes(st)) return true;
        if (b.isListingPaid && b.stripeListingSubscriptionId) return true;
        return false;
    });
}

const mergeClerkRole = async (clerkId, role) => {
    if (!clerkId) return;
    try {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const merged = { ...(clerkUser.unsafeMetadata || {}), role };
        await clerkClient.users.updateUser(clerkId, { unsafeMetadata: merged });
    } catch (clerkErr) {
        console.error('Clerk updateUser (onboarding):', clerkErr?.message || clerkErr);
    }
};

exports.sellerOnboardingOptions = (req, res) => {
    res.json({
        companyTypes: COMPANY_TYPES.map(({ value, label }) => ({ value, label })),
    });
};

exports.getMe = async (req, res) => {
    try {
        const u = req.user;
        const profile = u.sellerCompanyProfile
            ? {
                companyType: u.sellerCompanyProfile.companyType,
                companyName: u.sellerCompanyProfile.companyName,
                website: u.sellerCompanyProfile.website,
                owners: u.sellerCompanyProfile.owners,
                address: u.sellerCompanyProfile.address,
                contactPhone: u.sellerCompanyProfile.contactPhone,
                contactEmail: u.sellerCompanyProfile.contactEmail,
            }
            : null;
        let hasActiveSellerSubscription = false;
        if (u.role === 'seller') {
            hasActiveSellerSubscription = await hasActiveSellerListingSubscription(u._id);
        }

        res.json({
            email: u.email,
            role: u.role,
            needsRoleOnboarding: Boolean(u.needsRoleOnboarding),
            isPremium: Boolean(u.isPremium),
            hasActiveSellerSubscription,
            sellerCompanyProfile: profile,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyWebsite = async (req, res) => {
    try {
        const url = req.body?.url;
        const result = await verifyWebsiteUrl(url);
        if (!result.ok) {
            return res.status(400).json({ message: result.message || 'No se pudo verificar el sitio' });
        }
        res.json({ ok: true, url: result.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.onboardingExitFeedback = async (req, res) => {
    try {
        const reasonCode = req.body?.reasonCode;
        const step = typeof req.body?.step === 'string' ? req.body.step : 'seller-company';

        if (!ONBOARDING_EXIT_REASONS.includes(reasonCode)) {
            return res.status(400).json({ message: 'Opción inválida' });
        }

        const user = req.user;
        user.onboardingExitLog = Array.isArray(user.onboardingExitLog) ? user.onboardingExitLog : [];
        user.onboardingExitLog.push({ reasonCode, step, at: new Date() });
        if (user.onboardingExitLog.length > 30) {
            user.onboardingExitLog = user.onboardingExitLog.slice(-30);
        }
        await user.save();
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.completeRoleOnboarding = async (req, res) => {
    try {
        const { role } = req.body;
        if (role !== 'seller' && role !== 'buyer') {
            return res.status(400).json({ message: 'Rol inválido' });
        }

        if (role === 'seller') {
            return res.status(400).json({
                message: 'Completa antes el formulario de datos de tu empresa.',
            });
        }

        const user = req.user;
        if (!user.needsRoleOnboarding) {
            return res.json({ ok: true, role: user.role, alreadyComplete: true });
        }

        user.role = role;
        user.needsRoleOnboarding = false;
        await user.save();
        await mergeClerkRole(user.clerkId, role);

        res.json({ ok: true, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const normalizeEmail = (raw) => {
    if (typeof raw !== 'string') return null;
    const e = raw.trim().toLowerCase();
    if (!e) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
    return e;
};

/** Alineado con categorías de listado (CreateListing / mercado) */
const ONBOARDING_TYPE_TO_CATEGORY = {
    saas: 'Technology',
    ecommerce: 'Retail',
    retail: 'Retail',
    servicios: 'Services',
    manufactura: 'Manufacturing',
    alimentos: 'Food & Beverage',
    construccion: 'Services',
    salud: 'Healthcare',
    educacion: 'Services',
    logistica: 'Services',
    hospitalidad: 'Services',
    agro: 'Services',
    energia: 'Services',
    inmobiliario: 'Real Estate',
    otro: 'Services',
};

function guessLocationFromAddress(addressLine) {
    const parts = addressLine
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    if (parts.length >= 2) {
        return {
            city: parts[parts.length - 2],
            state: parts[parts.length - 1],
        };
    }
    return { city: '', state: '' };
}

async function assignUniqueBusinessSlug(title) {
    const base = slugify(String(title).trim(), { lower: true, strict: true }) || 'empresa';
    let slug = base;
    for (let i = 0; i < 12; i += 1) {
        const exists = await Business.findOne({ slug }).select('_id').lean();
        if (!exists) return slug;
        slug = `${base}-${crypto.randomBytes(3).toString('hex')}`;
    }
    throw new Error('Could not allocate unique slug');
}

exports.completeSellerOnboarding = async (req, res) => {
    try {
        const user = req.user;
        if (!user.needsRoleOnboarding) {
            return res.status(400).json({ message: 'El onboarding ya está completado' });
        }

        const {
            companyType,
            companyName,
            website,
            owners: ownersRaw,
            address,
            contactPhone,
            contactEmail: contactEmailRaw,
        } = req.body;

        if (typeof companyType !== 'string' || !COMPANY_TYPE_VALUES.has(companyType.trim())) {
            return res.status(400).json({ message: 'Tipo de empresa inválido' });
        }

        if (typeof companyName !== 'string' || companyName.trim().length < 2) {
            return res.status(400).json({ message: 'Indica el nombre de la empresa' });
        }

        if (typeof website !== 'string' || !website.trim()) {
            return res.status(400).json({ message: 'Indica el sitio web' });
        }

        const siteCheck = await verifyWebsiteUrl(website.trim());
        if (!siteCheck.ok) {
            return res.status(400).json({
                message: siteCheck.message || 'No pudimos verificar el sitio web. Revisa la URL e intenta de nuevo.',
            });
        }

        if (!Array.isArray(ownersRaw) || ownersRaw.length < 1) {
            return res.status(400).json({ message: 'Agrega al menos un propietario o responsable' });
        }

        const owners = ownersRaw
            .map((o) => ({
                name: typeof o?.name === 'string' ? o.name.trim() : '',
                companyRole: typeof o?.companyRole === 'string' ? o.companyRole.trim() : '',
            }))
            .filter((o) => o.name.length > 0 && o.companyRole.length > 0);

        if (owners.length < 1 || owners.length > 12) {
            return res.status(400).json({ message: 'Revisa los datos de propietarios (nombre y función)' });
        }

        if (typeof address !== 'string' || address.trim().length < 8) {
            return res.status(400).json({ message: 'Indica una dirección completa' });
        }

        if (typeof contactPhone !== 'string' || contactPhone.replace(/\D/g, '').length < 10) {
            return res.status(400).json({ message: 'Indica un teléfono de contacto válido' });
        }

        let contactEmail = user.email;
        if (contactEmailRaw !== undefined && contactEmailRaw !== null && String(contactEmailRaw).trim() !== '') {
            const parsed = normalizeEmail(String(contactEmailRaw));
            if (!parsed) {
                return res.status(400).json({ message: 'Correo de contacto inválido' });
            }
            contactEmail = parsed;
        }

        const trimmedType = companyType.trim();
        const companyNameClean = companyName.trim();
        const category =
            ONBOARDING_TYPE_TO_CATEGORY[trimmedType] || 'Services';
        const typeMeta = COMPANY_TYPES.find((t) => t.value === trimmedType);
        const sectorLabel = typeMeta ? typeMeta.label : 'Negocio';
        const slug = await assignUniqueBusinessSlug(companyNameClean);
        const location = guessLocationFromAddress(address.trim());

        const draftListing = new Business({
            title: companyNameClean,
            slug,
            description:
                'Listado iniciado al completar tu registro como vendedor. Completa precio, descripcion publica y detalles del negocio para enviarlo a revision.',
            category,
            sector: sectorLabel,
            giro: sectorLabel,
            size: 'Medium',
            location,
            financials: {},
            confidentialData: {
                businessName: companyNameClean,
                exactAddress: address.trim(),
                contactPhone: contactPhone.trim(),
                contactEmail,
                website: siteCheck.url,
            },
            sellerId: user._id,
            status: 'pending',
        });
        await draftListing.save();

        user.sellerCompanyProfile = {
            companyType: trimmedType,
            companyName: companyNameClean,
            website: siteCheck.url,
            websiteVerifiedAt: new Date(),
            owners,
            address: address.trim(),
            contactPhone: contactPhone.trim(),
            contactEmail,
        };
        user.role = 'seller';
        user.needsRoleOnboarding = false;
        await user.save();
        await mergeClerkRole(user.clerkId, 'seller');

        res.json({ ok: true, role: user.role, businessId: draftListing._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

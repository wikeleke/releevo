const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return null;
    const role = rawRole.trim().toLowerCase();
    return ['admin', 'seller', 'buyer'].includes(role) ? role : null;
};

const metadataRole = (metadata) => normalizeRole(metadata?.role);

const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    }
    return null;
};

const firstValidRole = (values) => values.find((value) => normalizeRole(value));

const firstValidBoolean = (values) => values.find((value) => parseBoolean(value) !== null);

/**
 * Clerk REST webhook payload snake_case
 */
exports.roleFromClerkWebhookUser = (clerkUser) => {
    const candidates = [
        clerkUser?.role,
        metadataRole(clerkUser?.public_metadata),
        metadataRole(clerkUser?.private_metadata),
    ];
    return candidates.find(Boolean) || null;
};

exports.accessFromClerkWebhookUser = (clerkUser) => {
    const roleCandidate = firstValidRole([
        clerkUser?.role,
        clerkUser?.public_metadata?.role,
        clerkUser?.publicMetadata?.role,
        clerkUser?.private_metadata?.role,
        clerkUser?.privateMetadata?.role,
    ]);

    const premiumCandidate = firstValidBoolean([
        clerkUser?.isPremium,
        clerkUser?.public_metadata?.isPremium,
        clerkUser?.publicMetadata?.isPremium,
        clerkUser?.private_metadata?.isPremium,
        clerkUser?.privateMetadata?.isPremium,
    ]);

    return {
        role: normalizeRole(roleCandidate),
        isPremium: parseBoolean(premiumCandidate),
    };
};

/**
 * @clerk/backend SDK user shape (camelCase)
 */
exports.roleFromClerkSdkUser = (clerkUser) => {
    const candidates = [
        metadataRole(clerkUser?.publicMetadata),
        metadataRole(clerkUser?.privateMetadata),
    ];
    return candidates.find(Boolean) || null;
};

exports.shouldUpgradeMongoRole = (currentRoleRaw, nextRoleRaw) => {
    const currentRole = normalizeRole(currentRoleRaw) || 'buyer';
    const nextRole = normalizeRole(nextRoleRaw);
    if (!nextRole || currentRole === nextRole) return false;
    if (currentRole === 'buyer' && (nextRole === 'seller' || nextRole === 'admin')) return true;
    if (currentRole === 'seller' && nextRole === 'admin') return true;
    return false;
};

exports.normalizeRole = normalizeRole;
exports.parseBoolean = parseBoolean;

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

const metadataPremium = (metadata) => parseBoolean(metadata?.isPremium);

/**
 * Clerk REST webhook payload snake_case
 */
exports.roleFromClerkWebhookUser = (clerkUser) => {
    const candidates = [
        clerkUser?.role,
        metadataRole(clerkUser?.public_metadata),
        metadataRole(clerkUser?.publicMetadata),
        metadataRole(clerkUser?.private_metadata),
        metadataRole(clerkUser?.privateMetadata),
    ];
    return candidates.find(Boolean) || null;
};

/**
 * @clerk/backend SDK user shape (camelCase)
 */
exports.roleFromClerkSdkUser = (clerkUser) => {
    const candidates = [
        normalizeRole(clerkUser?.role),
        metadataRole(clerkUser?.publicMetadata),
        metadataRole(clerkUser?.privateMetadata),
    ];
    return candidates.find(Boolean) || null;
};

exports.premiumFromClerkWebhookUser = (clerkUser) => {
    const candidates = [
        parseBoolean(clerkUser?.isPremium),
        metadataPremium(clerkUser?.public_metadata),
        metadataPremium(clerkUser?.publicMetadata),
        metadataPremium(clerkUser?.private_metadata),
        metadataPremium(clerkUser?.privateMetadata),
    ];
    return candidates.find((value) => value !== null) ?? null;
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

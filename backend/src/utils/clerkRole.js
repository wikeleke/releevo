const normalizeRole = (rawRole) => {
    if (typeof rawRole !== 'string') return null;
    const role = rawRole.trim().toLowerCase();
    return ['admin', 'seller', 'buyer'].includes(role) ? role : null;
};

const metadataRole = (metadata) => normalizeRole(metadata?.role);

/**
 * Clerk REST webhook payload snake_case
 */
exports.roleFromClerkWebhookUser = (clerkUser) => {
    const candidates = [
        clerkUser?.role,
        metadataRole(clerkUser?.public_metadata),
        metadataRole(clerkUser?.private_metadata),
        metadataRole(clerkUser?.unsafe_metadata),
    ];
    return candidates.find(Boolean) || null;
};

/**
 * @clerk/backend SDK user shape (camelCase)
 */
exports.roleFromClerkSdkUser = (clerkUser) => {
    const candidates = [
        metadataRole(clerkUser?.publicMetadata),
        metadataRole(clerkUser?.privateMetadata),
        metadataRole(clerkUser?.unsafeMetadata),
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

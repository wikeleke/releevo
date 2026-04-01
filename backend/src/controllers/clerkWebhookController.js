const crypto = require('crypto');
const { Webhook } = require('svix');
const User = require('../models/User');

const randomPassword = () => `clerk_${crypto.randomBytes(24).toString('hex')}`;

const normalizeRole = (rawRole) => {
  if (typeof rawRole !== 'string') return null;
  const role = rawRole.trim().toLowerCase();
  return ['admin', 'seller', 'buyer'].includes(role) ? role : null;
};

const shouldUpdateRole = (currentRoleRaw, nextRoleRaw) => {
  const currentRole = normalizeRole(currentRoleRaw);
  const nextRole = normalizeRole(nextRoleRaw);
  if (!nextRole || currentRole === nextRole) return false;

  // Role source of truth is Mongo; only allow role upgrades from Clerk.
  if (!currentRole) return true;
  if (currentRole === 'buyer' && (nextRole === 'seller' || nextRole === 'admin')) return true;
  if (currentRole === 'seller' && nextRole === 'admin') return true;
  return false;
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return null;
};

const getRoleAndPremium = (clerkUser) => {
  const metadataSources = [
    clerkUser?.public_metadata,
    clerkUser?.publicMetadata,
    clerkUser?.private_metadata,
    clerkUser?.privateMetadata,
    clerkUser?.unsafe_metadata,
    clerkUser?.unsafeMetadata,
  ];

  const roleCandidate = [
    clerkUser?.role,
    ...metadataSources.map((metadata) => metadata?.role),
  ].find((value) => normalizeRole(value));

  const premiumCandidate = [
    clerkUser?.isPremium,
    ...metadataSources.map((metadata) => metadata?.isPremium),
  ].find((value) => parseBoolean(value) !== null);

  return {
    role: normalizeRole(roleCandidate),
    isPremium: parseBoolean(premiumCandidate),
  };
};

const getPrimaryEmail = (clerkUser) => {
  const emailAddresses = clerkUser?.email_addresses || [];
  const primaryId = clerkUser?.primary_email_address_id;
  const primary = emailAddresses.find((email) => email.id === primaryId);
  return (primary?.email_address || emailAddresses[0]?.email_address || '').toLowerCase().trim();
};

const upsertFromClerkUser = async (clerkUser) => {
  const clerkId = clerkUser.id;
  const email = getPrimaryEmail(clerkUser);
  const { role, isPremium } = getRoleAndPremium(clerkUser);

  if (!email) {
    throw new Error(`Missing email for Clerk user ${clerkId}`);
  }

  let user = await User.findOne({ clerkId });

  if (!user) {
    user = await User.findOne({ email });
  }

  if (!user) {
    user = new User({
      clerkId,
      email,
      password: randomPassword(),
      role: role || 'buyer',
      isPremium: isPremium ?? false,
    });
    await user.save();
    return user;
  }

  user.clerkId = clerkId;
  user.email = email;
  if (shouldUpdateRole(user.role, role)) {
    user.role = role;
  }
  if (isPremium !== null) {
    user.isPremium = isPremium;
  }
  await user.save();
  return user;
};

exports.handleClerkWebhook = async (req, res) => {
  let event;
  try {
    const secret = (process.env.CLERK_WEBHOOK_SIGNING_SECRET || '').trim();
    if (!secret) {
      return res.status(500).json({ message: 'Missing CLERK_WEBHOOK_SIGNING_SECRET' });
    }

    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ message: 'Missing Svix headers' });
    }

    const payload = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body || {});
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (error) {
    console.error('Clerk webhook signature verification error:', error);
    return res.status(400).json({ message: 'Invalid Clerk webhook payload' });
  }

  try {
    const { type, data } = event;

    if (type === 'user.created' || type === 'user.updated') {
      const email = getPrimaryEmail(data);
      if (!email) {
        // Some synthetic test payloads might not include email addresses.
        return res.status(200).json({ ok: true, action: type, ignored: 'missing_email' });
      }
      const user = await upsertFromClerkUser(data);
      return res.status(200).json({
        ok: true,
        action: type,
        userId: user._id,
        clerkId: user.clerkId,
        email: user.email,
      });
    }

    if (type === 'user.deleted') {
      // For deleted Clerk users keep Mongo user record for references, just unlink clerkId.
      const clerkId = data?.id;
      if (clerkId) {
        await User.findOneAndUpdate(
          { clerkId },
          { $unset: { clerkId: '' } },
          { returnDocument: 'after' }
        );
      }
      return res.status(200).json({ ok: true, action: type });
    }

    return res.status(200).json({ ok: true, ignored: true, action: type });
  } catch (error) {
    console.error('Clerk webhook processing error:', error);
    return res.status(500).json({ message: 'Clerk webhook processing failed' });
  }
};

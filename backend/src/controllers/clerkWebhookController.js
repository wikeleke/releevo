const crypto = require('crypto');
const { Webhook } = require('svix');
const User = require('../models/User');

const { accessFromClerkWebhookUser, shouldUpgradeMongoRole } = require('../utils/clerkRole');

const randomPassword = () => `clerk_${crypto.randomBytes(24).toString('hex')}`;

const getPrimaryEmail = (clerkUser) => {
  const emailAddresses = clerkUser?.email_addresses || [];
  const primaryId = clerkUser?.primary_email_address_id;
  const primary = emailAddresses.find((email) => email.id === primaryId);
  return (primary?.email_address || emailAddresses[0]?.email_address || '').toLowerCase().trim();
};

const upsertFromClerkUser = async (clerkUser) => {
  const clerkId = clerkUser.id;
  const email = getPrimaryEmail(clerkUser);
  const { role, isPremium } = accessFromClerkWebhookUser(clerkUser);

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
      needsRoleOnboarding: !role,
    });
    await user.save();
    return user;
  }

  // Identity + optional role upgrade from Clerk (buyer -> seller/admin).
  user.clerkId = clerkId;
  user.email = email;
  if (role && shouldUpgradeMongoRole(user.role, role)) {
    user.role = role;
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

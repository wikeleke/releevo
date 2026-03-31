const crypto = require('crypto');
const { Webhook } = require('svix');
const User = require('../models/User');

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
      role: 'buyer',
      isPremium: false,
    });
    await user.save();
    return user;
  }

  user.clerkId = clerkId;
  user.email = email;
  await user.save();
  return user;
};

exports.handleClerkWebhook = async (req, res) => {
  try {
    const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Missing CLERK_WEBHOOK_SIGNING_SECRET' });
    }

    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ message: 'Missing Svix headers' });
    }

    const payload = req.body.toString('utf8');
    const wh = new Webhook(secret);
    const event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    const { type, data } = event;

    if (type === 'user.created' || type === 'user.updated') {
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
    console.error('Clerk webhook error:', error);
    return res.status(400).json({ message: 'Invalid Clerk webhook payload' });
  }
};

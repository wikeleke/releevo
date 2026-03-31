const mongoose = require('mongoose');
require('dotenv').config();
const { clerkClient } = require('@clerk/express');
const User = require('./src/models/User');

// Keep this list aligned with seed.js / rotate-passwords.js
const testUsers = [
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

async function getClerkUserByEmail(email) {
  const response = await clerkClient.users.getUserList({
    emailAddress: [email],
    limit: 1,
  });

  if (Array.isArray(response)) {
    return response[0] || null;
  }
  if (Array.isArray(response?.data)) {
    return response.data[0] || null;
  }
  return null;
}

async function createClerkUser(user) {
  return clerkClient.users.createUser({
    emailAddress: [user.email],
    password: user.password,
    publicMetadata: {
      role: user.role,
      isPremium: user.isPremium,
    },
  });
}

async function updateClerkUser(userId, user) {
  return clerkClient.users.updateUser(userId, {
    password: user.password,
    publicMetadata: {
      role: user.role,
      isPremium: user.isPremium,
    },
  });
}

async function syncUserToClerk(seedUser) {
  const existing = await getClerkUserByEmail(seedUser.email);
  if (existing) {
    const updated = await updateClerkUser(existing.id, seedUser);
    return { action: 'updated', clerkUser: updated };
  }

  const created = await createClerkUser(seedUser);
  return { action: 'created', clerkUser: created };
}

async function syncClerkUsers() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment');
  }
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('Missing CLERK_SECRET_KEY in environment');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  const results = [];
  for (const seedUser of testUsers) {
    const { action, clerkUser } = await syncUserToClerk(seedUser);
    const normalizedEmail = seedUser.email.toLowerCase();

    // Ensure unique clerkId mapping in Mongo before linking this email.
    await User.updateMany(
      { clerkId: clerkUser.id, email: { $ne: normalizedEmail } },
      { $unset: { clerkId: '' } }
    );

    let mongoUser = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          clerkId: clerkUser.id,
          role: seedUser.role,
          isPremium: seedUser.isPremium,
          password: seedUser.password,
        },
      },
      { returnDocument: 'after' }
    );

    if (!mongoUser) {
      mongoUser = new User({
        email: normalizedEmail,
        password: seedUser.password,
        role: seedUser.role,
        isPremium: seedUser.isPremium,
        clerkId: clerkUser.id,
      });
      await mongoUser.save();
    }

    results.push({
      email: seedUser.email,
      action,
      clerkId: clerkUser.id,
      mongoLinked: !!mongoUser,
    });
  }

  console.log('\n✅ Clerk sync complete:\n');
  for (const item of results) {
    console.log(
      `${item.email} | clerk=${item.action} | clerkId=${item.clerkId} | mongoLinked=${item.mongoLinked}`
    );
  }
}

syncClerkUsers()
  .catch((err) => {
    console.error('❌ sync-clerk-users error:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected');
  });

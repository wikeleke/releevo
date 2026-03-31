const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const SPECIALS = '!@#$%^&*()-_=+[]{}';

function randomFrom(chars) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateStrongPassword(length = 14) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const all = upper + lower + digits + SPECIALS;

  const chars = [
    randomFrom(upper),
    randomFrom(lower),
    randomFrom(digits),
    randomFrom(SPECIALS),
  ];

  while (chars.length < length) {
    chars.push(randomFrom(all));
  }

  return shuffle(chars).join('');
}

const predefinedPasswords = {
  'admin@releevo.com': 'Rv!A9kLm#27Qp',
  'superadmin@releevo.com': 'Rv!S8dTy$64Mn',
  'seller1@releevo.com': 'Rv!Se1#Qw73Lp',
  'seller2@releevo.com': 'Rv!Se2$Zx58Kt',
  'seller3@releevo.com': 'Rv!Se3%Vb91Hr',
  'seller4@releevo.com': 'Rv!Se4&Nm46Dj',
  'seller5@releevo.com': 'Rv!Se5*Gt82Cx',
  'buyer1@releevo.com': 'Rv!By1#Lq74Wp',
  'buyer2@releevo.com': 'Rv!By2$Fr69Zd',
  'buyer3@releevo.com': 'Rv!By3%Hp53Xs',
};

async function updateClerkPassword(clerkId, password) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { skipped: true, reason: 'CLERK_SECRET_KEY is missing' };
  }

  const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    let details = `HTTP ${response.status}`;
    try {
      const payload = await response.json();
      if (payload && payload.errors) {
        details = `${details} ${JSON.stringify(payload.errors)}`;
      }
    } catch (e) {
      // ignore JSON parse error
    }
    throw new Error(details);
  }

  return { skipped: false };
}

async function rotatePasswords() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  const users = await User.find({}).sort({ email: 1 });
  if (!users.length) {
    console.log('ℹ️ No users found.');
    return;
  }

  const output = [];

  for (const user of users) {
    const email = (user.email || '').toLowerCase();
    const newPassword = predefinedPasswords[email] || generateStrongPassword(14);

    user.password = newPassword;
    await user.save();

    let clerkStatus = 'not-linked';
    if (user.clerkId) {
      try {
        const res = await updateClerkPassword(user.clerkId, newPassword);
        clerkStatus = res.skipped ? `skipped (${res.reason})` : 'updated';
      } catch (error) {
        clerkStatus = `failed (${error.message})`;
      }
    }

    output.push({
      email: user.email,
      role: user.role,
      clerkId: user.clerkId || '-',
      clerkStatus,
      password: newPassword,
    });
  }

  console.log('\n✅ Passwords rotated for all users:\n');
  for (const item of output) {
    console.log(
      `${item.email} | role=${item.role} | clerk=${item.clerkStatus} | password=${item.password}`
    );
  }
}

rotatePasswords()
  .catch((err) => {
    console.error('❌ rotate-passwords error:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected');
  });

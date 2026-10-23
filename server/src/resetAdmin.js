/**
 * Admin credential reset: `npm run reset-admin`
 *
 * Reads MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD from the environment
 * (server/.env is loaded automatically) and upserts that single admin account.
 * Existing admins are never deleted and no other collection is touched.
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { Admin } from './models/index.js';

// Must match auth.controller.js (change-password) so login's bcrypt.compare works.
const BCRYPT_ROUNDS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function readConfig() {
  const mongoUri = (env.MONGO_URI || '').trim();
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!mongoUri) fail('MONGO_URI is required (set it in server/.env or the environment).');
  if (!email) fail('ADMIN_EMAIL is required (set it in server/.env or the environment).');
  if (!EMAIL_RE.test(email)) fail('ADMIN_EMAIL must be a valid email address.');
  if (!password) fail('ADMIN_PASSWORD is required (set it in server/.env or the environment).');
  if (password.length < 8) fail('ADMIN_PASSWORD must be at least 8 characters.');

  return { email, password };
}

async function run() {
  const { email, password } = readConfig();

  await connectDB();
  const { host, name } = mongoose.connection;
  console.log(`Connected to MongoDB host: ${host} (database: ${name})`);

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const existing = await Admin.findOne({ email }).select('+passwordHash');

  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`admin updated (${email})`);
  } else {
    await Admin.create({ email, passwordHash });
    console.log(`admin created (${email})`);
  }

  await disconnectDB();
}

run().catch(async (error) => {
  console.error(`❌ Admin reset failed: ${error.message}`);
  try {
    await disconnectDB();
  } catch {
    /* ignore */
  }
  process.exit(1);
});

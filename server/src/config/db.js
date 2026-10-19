import mongoose from 'mongoose';
import { env, isProd } from './env.js';

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getDbState = () => READY_STATES[mongoose.connection.readyState] ?? 'unknown';

/**
 * Connect to MongoDB. Resolves once connected, rejects on failure.
 */
export async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    if (!isProd) console.warn('⚠️  MongoDB disconnected');
  });

  const conn = await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  return conn;
}

/**
 * Gracefully close the connection (used by the seed script and shutdown hooks).
 */
export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('MongoDB connection closed');
}

import mongoose from 'mongoose';
import { env, isProd } from './env.js';

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getDbState = () => READY_STATES[mongoose.connection.readyState] ?? 'unknown';

let cached = globalThis.__mongooseCache;
if (!cached) {
  cached = globalThis.__mongooseCache = { conn: null, promise: null, listenersBound: false };
}

/**
 * Connect to MongoDB. Resolves once connected, rejects on failure.
 * The connection promise is cached so serverless invocations reuse the same
 * connection instead of opening a new one on every cold/warm request.
 */
export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.listenersBound) {
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

    cached.listenersBound = true;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Gracefully close the connection (used by the seed script and shutdown hooks).
 */
export async function disconnectDB() {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  console.log('MongoDB connection closed');
}

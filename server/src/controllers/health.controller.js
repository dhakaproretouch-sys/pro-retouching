import mongoose from 'mongoose';
import { getDbState } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/health
 */
export const health = asyncHandler(async (req, res) => {
  const dbState = getDbState();

  sendSuccess(
    res,
    {
      status: dbState === 'connected' ? 'up' : 'degraded',
      db: dbState,
      env: process.env.NODE_ENV || 'development',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      mongoHost: mongoose.connection.host ?? null,
    },
    'Server is healthy'
  );
});

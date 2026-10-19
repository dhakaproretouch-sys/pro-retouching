import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response.js';

/**
 * General API limiter: 300 requests / 15 minutes / IP.
 * Tighten this per-route (e.g. auth, contact forms) in later phases.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    sendError(res, 'Too many requests, please try again later.', 429),
});

/** Stricter limiter for sensitive/expensive endpoints (login, uploads, forms). */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    sendError(res, 'Too many requests, please try again later.', 429),
});

/** Login limiter: 5 attempts / 15 minutes / IP (successful logins don't count). */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    sendError(res, 'Too many login attempts. Please try again in 15 minutes.', 429),
});

export default apiLimiter;

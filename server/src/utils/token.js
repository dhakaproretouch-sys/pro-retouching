import jwt from 'jsonwebtoken';
import { env, isProd } from '../config/env.js';

export const AUTH_COOKIE = 'admin_token';
const TOKEN_TTL = '7d';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Cookie options: httpOnly, secure in production, sameSite none/lax. */
function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: MAX_AGE_MS,
  };
}

/** Sign a JWT for an admin payload (e.g. { sub, email, role }). */
export function signAdminToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

/** Verify a JWT signed with JWT_SECRET. Throws on invalid/expired tokens. */
export function verifyAdminToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

/** Store the JWT in an httpOnly cookie. */
export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE, token, baseCookieOptions());
}

/** Clear the auth cookie (same flags as when it was set, minus maxAge). */
export function clearAuthCookie(res) {
  const { maxAge, ...options } = baseCookieOptions();
  res.clearCookie(AUTH_COOKIE, options);
}

export default signAdminToken;

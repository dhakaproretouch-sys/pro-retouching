import { Admin } from '../models/index.js';
import { AUTH_COOKIE, verifyAdminToken } from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from './errorHandler.js';

/**
 * Protects every /api/admin route.
 * Reads the httpOnly JWT cookie, verifies it and attaches `req.admin`.
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = verifyAdminToken(token);
  } catch (error) {
    throw new ApiError(401, 'Session expired or invalid, please log in again');
  }

  const admin = await Admin.findById(payload.sub).select('email role');
  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists');
  }

  req.admin = {
    id: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  };

  next();
});

export default requireAuth;

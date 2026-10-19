import bcrypt from 'bcryptjs';
import { Admin } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { ApiError } from '../middleware/errorHandler.js';
import { signAdminToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';

/** POST /api/auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+passwordHash');
  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signAdminToken({
    sub: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  });
  setAuthCookie(res, token);

  sendSuccess(res, { admin: { id: admin._id, email: admin.email, role: admin.role } }, 'Logged in');
});

/** POST /api/auth/logout */
export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, null, 'Logged out');
});

/** GET /api/auth/me */
export const me = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-__v');
  if (!admin) throw new ApiError(401, 'Admin account no longer exists');
  sendSuccess(res, { admin }, 'OK');
});

/** PUT /api/auth/change-password */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin.id).select('+passwordHash');
  if (!admin) throw new ApiError(401, 'Admin account no longer exists');

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) throw new ApiError(400, 'Current password is incorrect');

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await admin.save();

  sendSuccess(res, null, 'Password updated');
});

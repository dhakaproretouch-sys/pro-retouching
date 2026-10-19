import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { ApiError } from '../middleware/errorHandler.js';
import { cloudinaryConfigured, uploadBuffer } from '../config/cloudinary.js';

/**
 * POST /api/admin/upload
 * Multipart field: "image" (single file, jpg/png/webp, max 10 MB).
 * Returns { url, publicId }.
 */
export const adminUpload = asyncHandler(async (req, res) => {
  if (!cloudinaryConfigured) {
    throw new ApiError(503, 'File uploads are temporarily unavailable (Cloudinary is not configured)');
  }
  if (!req.file) {
    throw new ApiError(400, 'No file received. Send the image in the "image" field');
  }

  const { url, publicId } = await uploadBuffer(req.file.buffer, 'pro-retouching/admin');
  sendSuccess(res, { url, publicId }, 'File uploaded', 201);
});

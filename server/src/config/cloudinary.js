import { v2 as cloudinary } from 'cloudinary';
import { env, cloudinaryConfigured } from './env.js';

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  console.warn('⚠️  Cloudinary is not configured - file uploads will be disabled until CLOUDINARY_* env values are set.');
}

export { cloudinary, cloudinaryConfigured };

/**
 * Upload a Buffer to Cloudinary (used with the multer memoryStorage middleware).
 * @returns {Promise<{url: string, publicId: string}>}
 */
export function uploadBuffer(buffer, folder = 'pro-retouching') {
  if (!cloudinaryConfigured) {
    return Promise.reject(new Error('Cloudinary is not configured'));
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Destroy an asset by its Cloudinary public id (safe no-op when unconfigured).
 */
export async function destroyAsset(publicId) {
  if (!cloudinaryConfigured || !publicId) return null;
  return cloudinary.uploader.destroy(publicId);
}

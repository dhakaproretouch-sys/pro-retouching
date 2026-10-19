import multer from 'multer';
import { ApiError } from './errorHandler.js';

const MB = 1024 * 1024;

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
];

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) return cb(null, true);
  return cb(new ApiError(415, `Unsupported file type: ${file.mimetype}`), false);
};

const imageOnlyFilter = (req, file, cb) => {
  if (IMAGE_MIMES.includes(file.mimetype)) return cb(null, true);
  return cb(
    new ApiError(415, `Only JPG, PNG and WebP images are allowed (got ${file.mimetype})`),
    false
  );
};

/** General-purpose uploads (images, PDFs, zips) up to 20 MB. */
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * MB },
});

/** Single image upload (admin panel) up to 10 MB. */
export const uploadImage = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 10 * MB },
});

/** Multi image uploads (public free-test form): max 5 files, 5 MB each. */
export const uploadImages = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 5 * MB, files: 5 },
});

export default upload;

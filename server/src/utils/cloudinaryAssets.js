import { destroyAsset } from '../config/cloudinary.js';

/**
 * Derive a Cloudinary public id from a secure URL.
 * e.g. https://res.cloudinary.com/demo/image/upload/v123/folder/img.jpg → folder/img
 * Returns null for anything that is not a Cloudinary URL (e.g. local /images/... paths).
 */
export function publicIdFromUrl(url) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;
  const withoutQuery = url.split('?')[0];
  const marker = '/upload/';
  const index = withoutQuery.indexOf(marker);
  if (index === -1) return null;

  let rest = withoutQuery.slice(index + marker.length);
  // Drop the transformation segment when present (e.g. /upload/w_800,c_fit/...)
  const segments = rest.split('/');
  if (segments.length > 1 && /^[a-z]{1,3}_[^/]+$/i.test(segments[0])) segments.shift();
  // Drop the version segment (v1234567890)
  if (segments.length > 1 && /^v\d+$/.test(segments[0])) segments.shift();

  const joined = segments.join('/');
  if (!joined) return null;
  return joined.replace(/\.[^.]+$/, '');
}

/**
 * Collect every Cloudinary public id referenced by a document
 * (its `publicId` field plus any Cloudinary URLs in `fields`).
 */
export function collectPublicIds(doc, fields = []) {
  const ids = new Set();
  if (!doc) return ids;

  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };

  if (typeof plain.publicId === 'string' && plain.publicId.trim()) {
    ids.add(plain.publicId.trim());
  }

  for (const field of fields) {
    const value = plain[field];
    if (typeof value === 'string' && value) {
      const publicId = publicIdFromUrl(value);
      if (publicId) ids.add(publicId);
    }
  }

  return ids;
}

/**
 * Best-effort deletion of the Cloudinary assets referenced by a document.
 * Never throws - cleanup must not break the main operation.
 */
export async function destroyDocImages(doc, fields = []) {
  const ids = collectPublicIds(doc, fields);
  if (ids.size === 0) return;
  await Promise.all([...ids].map((id) => destroyAsset(id).catch(() => null)));
}

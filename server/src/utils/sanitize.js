/**
 * String sanitization helpers for user-submitted content.
 * (Mongo-operator sanitization is already handled by express-mongo-sanitize.)
 */

/** Strip HTML tags, control characters and trim. */
export function sanitizeString(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
}

/** Recursively sanitize every string in a plain object/array. */
export function sanitizeDeep(input) {
  if (typeof input === 'string') return sanitizeString(input);
  if (Array.isArray(input)) return input.map(sanitizeDeep);
  if (input && typeof input === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(input)) out[key] = sanitizeDeep(value);
    return out;
  }
  return input;
}

/** Escape a user string so it can safely be embedded in a RegExp. */
export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default sanitizeString;

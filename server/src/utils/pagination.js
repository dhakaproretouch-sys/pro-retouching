import { escapeRegex } from './sanitize.js';

/**
 * Parse ?page= & ?limit= with sane defaults and caps.
 */
export function parsePagination(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit)
  );
  return { page, limit, skip: (page - 1) * limit };
}

/** Build a case-insensitive $or filter for the given search string. */
export function buildSearchFilter(search, fields) {
  if (!search || !fields?.length) return {};
  const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
  return { $or: fields.map((field) => ({ [field]: rx })) };
}

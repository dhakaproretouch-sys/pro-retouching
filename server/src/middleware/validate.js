import { ApiError } from './errorHandler.js';

/**
 * Zod validation middleware.
 * Usage: router.post('/', validate({ body: MyZodSchema }), handler)
 * Supported keys: body, query, params. Parsed values replace the originals
 * (so handlers only ever see validated, type-coerced data).
 */
export const validate = (schemas) => (req, res, next) => {
  for (const key of ['params', 'query', 'body']) {
    const schema = schemas[key];
    if (!schema) continue;

    const result = schema.safeParse(req[key]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(
        new ApiError(422, `Validation failed for "${key}"`, { issues: details })
      );
    }
    req[key] = result.data;
  }
  return next();
};

export default validate;

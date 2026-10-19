import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { ApiError } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import { destroyDocImages } from '../utils/cloudinaryAssets.js';
import { escapeRegex } from '../utils/sanitize.js';
import { idParamSchema, listQuerySchema, reorderSchema } from '../validators/schemas.js';

/** Turn a title into a url-safe slug (used when slug is not provided). */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generic CRUD controller factory - one implementation for every content
 * collection (slides, services, works, pricing, stats, logos, faqs, testimonials).
 *
 * @param {object} options
 * @param {import('mongoose').Model} options.Model
 * @param {string} options.name            Human name used in messages
 * @param {string[]} [options.imageFields] Fields that may hold Cloudinary URLs
 * @param {string[]} [options.searchableFields]
 * @param {string|null} [options.slugField] Auto-slugify from `title` when empty
 */
export function createCrudControllers({
  Model,
  name,
  imageFields = [],
  searchableFields = [],
  slugField = null,
}) {
  const ensureUniqueSlug = async (data, excludeId = null) => {
    if (!slugField) return;
    if (!data[slugField] && data.title) data[slugField] = slugify(data.title);
    if (!data[slugField]) return;
    const clash = await Model.findOne({
      [slugField]: data[slugField],
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (clash) throw new ApiError(409, `Slug "${data[slugField]}" is already in use`);
  };

  const list = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.search && searchableFields.length) {
      const rx = new RegExp(escapeRegex(req.query.search), 'i');
      filter.$or = searchableFields.map((field) => ({ [field]: rx }));
    }
    const items = await Model.find(filter).sort({ order: 1, createdAt: 1 });
    sendSuccess(res, items, `${name} list`);
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, `${name} not found`);
    sendSuccess(res, item, `${name} fetched`);
  });

  const create = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    await ensureUniqueSlug(data);
    const item = await Model.create(data);
    sendSuccess(res, item, `${name} created`, 201);
  });

  const update = asyncHandler(async (req, res) => {
    const old = await Model.findById(req.params.id);
    if (!old) throw new ApiError(404, `${name} not found`);

    const data = { ...req.body };
    await ensureUniqueSlug(data, req.params.id);

    const updated = await Model.findByIdAndUpdate(req.params.id, { $set: data }, {
      new: true,
      runValidators: true,
    });

    // Delete the old Cloudinary asset when an image was replaced or cleared
    const imageChanged =
      imageFields.length > 0 &&
      imageFields.some(
        (field) => data[field] !== undefined && String(data[field]) !== String(old.get(field))
      );
    const publicIdChanged =
      data.publicId !== undefined && String(data.publicId) !== String(old.get('publicId'));
    if (imageChanged || publicIdChanged) {
      await destroyDocImages(old, imageFields);
    }

    sendSuccess(res, updated, `${name} updated`);
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, `${name} not found`);
    if (imageFields.length) await destroyDocImages(item, imageFields);
    sendSuccess(res, item, `${name} deleted`);
  });

  const toggle = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, `${name} not found`);
    if (typeof item.isActive !== 'boolean') {
      throw new ApiError(400, `${name} does not support isActive`);
    }
    item.isActive = !item.isActive;
    await item.save();
    sendSuccess(res, item, `${name} ${item.isActive ? 'activated' : 'deactivated'}`);
  });

  const reorder = asyncHandler(async (req, res) => {
    const ops = req.body.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));
    const result = await Model.bulkWrite(ops);
    sendSuccess(res, { modified: result.modifiedCount, matched: result.matchedCount }, `${name} reordered`);
  });

  return { list, getOne, create, update, remove, toggle, reorder };
}

/**
 * Build an Express router with the standard admin CRUD surface:
 *   GET    /            list (all items, ?search=)
 *   GET    /:id         one item
 *   POST   /            create
 *   PUT    /:id         update (cleans up replaced Cloudinary images)
 *   PATCH  /:id/toggle  flip isActive
 *   DELETE /:id         delete (cleans up Cloudinary images)
 *   PUT    /reorder     bulk [{ id, order }]
 */
export function createCrudRouter({
  Model,
  name,
  imageFields = [],
  searchableFields = [],
  slugField = null,
  createSchema,
  updateSchema,
}) {
  const controllers = createCrudControllers({
    Model,
    name,
    imageFields,
    searchableFields,
    slugField,
  });

  const router = Router();

  router.get('/', validate({ query: listQuerySchema }), controllers.list);
  router.put('/reorder', validate({ body: reorderSchema }), controllers.reorder);
  router.get('/:id', validate({ params: idParamSchema }), controllers.getOne);
  router.post('/', validate({ body: createSchema }), controllers.create);
  router.put('/:id', validate({ params: idParamSchema, body: updateSchema }), controllers.update);
  router.patch('/:id/toggle', validate({ params: idParamSchema }), controllers.toggle);
  router.delete('/:id', validate({ params: idParamSchema }), controllers.remove);

  return router;
}

import { Router } from 'express';
import { z } from 'zod';
import {
  Quote,
  FreeTest,
  Message,
  Work,
  HeroSlide,
  Service,
  PricingPlan,
  Stat,
  ClientLogo,
  FAQ,
  Testimonial,
} from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { ApiError } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import {
  inboxQuerySchema,
  idParamSchema,
} from '../validators/schemas.js';
import { parsePagination, buildSearchFilter } from '../utils/pagination.js';
import { toCsv, sendCsv } from '../utils/csv.js';
import { destroyAsset } from '../config/cloudinary.js';

/* ------------------------------------------------------------------ *
 * Inbox routers (quotes, free-tests, messages) with pagination
 * ------------------------------------------------------------------ */

function createInboxRouter({ Model, name, searchableFields, statusEnum = null }) {
  const router = Router();

  const list = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {
      ...buildSearchFilter(req.query.search, searchableFields),
      ...(req.query.status && statusEnum ? { status: req.query.status } : {}),
    };

    const [items, total] = await Promise.all([
      Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Model.countDocuments(filter),
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  });

  const updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!item) throw new ApiError(404, `${name} not found`);
    sendSuccess(res, item, `${name} status updated`);
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, `${name} not found`);
    // Clean up Cloudinary files on free-test deletion
    if (Array.isArray(item.files) && item.files.length) {
      await Promise.all(
        item.files.map((file) => file.publicId && destroyAsset(file.publicId).catch(() => null))
      );
    }
    sendSuccess(res, item, `${name} deleted`);
  });

  const statusSchema = statusEnum
    ? z.object({ status: z.enum(statusEnum) })
    : null;

  router.get('/', validate({ query: inboxQuerySchema }), list);
  if (statusSchema) {
    router.patch(
      '/:id/status',
      validate({ params: idParamSchema, body: statusSchema }),
      updateStatus
    );
  }
  router.delete('/:id', validate({ params: idParamSchema }), remove);

  return router;
}

export const quotesRouter = createInboxRouter({
  Model: Quote,
  name: 'Quote',
  searchableFields: ['email', 'service'],
  statusEnum: ['new', 'in_progress', 'done'],
});

export const freeTestsRouter = createInboxRouter({
  Model: FreeTest,
  name: 'FreeTest',
  searchableFields: ['email', 'name', 'service'],
  statusEnum: ['pending', 'in_progress', 'done'],
});

export const messagesRouter = createInboxRouter({
  Model: Message,
  name: 'Message',
  searchableFields: ['email', 'name', 'message'],
});

/** PATCH /api/admin/messages/:id/read */
export const markMessageRead = asyncHandler(async (req, res) => {
  const { isRead } = req.body;
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { $set: { isRead } },
    { new: true }
  );
  if (!message) throw new ApiError(404, 'Message not found');
  sendSuccess(res, message, 'Message updated');
});

/* ------------------------------------------------------------------ *
 * GET /api/admin/stats
 * ------------------------------------------------------------------ */

export const getStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    newQuotes,
    newFreeTests,
    unreadMessages,
    totalWorks,
    requestsPerDay,
  ] = await Promise.all([
    Quote.countDocuments({ status: 'new' }),
    FreeTest.countDocuments({ status: 'pending' }),
    Message.countDocuments({ isRead: false }),
    Work.countDocuments({}),
    Quote.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]),
  ]);

  sendSuccess(res, {
    newQuotes,
    newFreeTests,
    unreadMessages,
    totalWorks,
    requestsPerDay,
  });
});

/* ------------------------------------------------------------------ *
 * GET /api/admin/export/:type  (CSV)
 * ------------------------------------------------------------------ */

const EXPORT_CONFIGS = {
  quotes: {
    Model: Quote,
    columns: [
      { key: 'email', label: 'Email' },
      { key: 'service', label: 'Service' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Created' },
    ],
  },
  'free-tests': {
    Model: FreeTest,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'whatsapp', label: 'WhatsApp' },
      { key: 'service', label: 'Service' },
      { key: 'status', label: 'Status' },
      {
        key: 'files',
        label: 'Files',
        value: (row) => (row.files || []).map((f) => f.url).join('; '),
      },
      { key: 'createdAt', label: 'Created' },
    ],
  },
  messages: {
    Model: Message,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'service', label: 'Service' },
      { key: 'message', label: 'Message' },
      { key: 'isRead', label: 'Read' },
      { key: 'createdAt', label: 'Created' },
    ],
  },
  slides: {
    Model: HeroSlide,
    columns: [
      { key: 'alt', label: 'Alt' },
      { key: 'image', label: 'Image URL' },
      { key: 'order', label: 'Order' },
      { key: 'isActive', label: 'Active' },
      { key: 'createdAt', label: 'Created' },
    ],
  },
  services: {
    Model: Service,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'shortDesc', label: 'Short Description' },
      { key: 'order', label: 'Order' },
      { key: 'isActive', label: 'Active' },
      { key: 'createdAt', label: 'Created' },
    ],
  },
  works: {
    Model: Work,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'beforeImage', label: 'Before Image' },
      { key: 'afterImage', label: 'After Image' },
      { key: 'order', label: 'Order' },
      { key: 'isActive', label: 'Active' },
    ],
  },
  pricing: {
    Model: PricingPlan,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Price' },
      { key: 'unit', label: 'Unit' },
      { key: 'isPopular', label: 'Popular' },
      { key: 'order', label: 'Order' },
    ],
  },
  stats: {
    Model: Stat,
    columns: [
      { key: 'label', label: 'Label' },
      { key: 'value', label: 'Value' },
      { key: 'suffix', label: 'Suffix' },
      { key: 'order', label: 'Order' },
    ],
  },
  logos: {
    Model: ClientLogo,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'image', label: 'Image URL' },
      { key: 'order', label: 'Order' },
    ],
  },
  faqs: {
    Model: FAQ,
    columns: [
      { key: 'question', label: 'Question' },
      { key: 'answer', label: 'Answer' },
      { key: 'order', label: 'Order' },
    ],
  },
  testimonials: {
    Model: Testimonial,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'text', label: 'Text' },
      { key: 'order', label: 'Order' },
    ],
  },
};

export const exportCsv = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const config = EXPORT_CONFIGS[type];
  if (!config) throw new ApiError(404, `Unknown export type: ${type}`);

  const rows = await config.Model.find({}).sort({ createdAt: -1 });
  const csv = toCsv(rows, config.columns);
  const filename = `pro-retouching-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  sendCsv(res, filename, csv);
});

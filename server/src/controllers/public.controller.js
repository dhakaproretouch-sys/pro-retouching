import {
  HeroSlide,
  Service,
  Work,
  PricingPlan,
  Stat,
  ClientLogo,
  FAQ,
  Testimonial,
  SiteSettings,
  Quote,
  Message,
  FreeTest,
} from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { ApiError } from '../middleware/errorHandler.js';
import { sanitizeDeep } from '../utils/sanitize.js';
import { cloudinaryConfigured, uploadBuffer, destroyAsset } from '../config/cloudinary.js';

/* ------------------------------------------------------------------ *
 * Public GET - only active content, sorted by order
 * ------------------------------------------------------------------ */

const activeOnly = (Model) => asyncHandler(async (req, res) => {
  const items = await Model.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  sendSuccess(res, items);
});

const allSorted = (Model) => asyncHandler(async (req, res) => {
  const items = await Model.find({}).sort({ order: 1, createdAt: 1 });
  sendSuccess(res, items);
});

export const listSlides = activeOnly(HeroSlide);
export const listServices = activeOnly(Service);
export const listWorks = activeOnly(Work);
export const listPricing = allSorted(PricingPlan);
export const listStats = allSorted(Stat);
export const listLogos = allSorted(ClientLogo);
export const listFaqs = allSorted(FAQ);
export const listTestimonials = allSorted(Testimonial);

/** GET /api/public/services/:slug */
export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!service) throw new ApiError(404, 'Service not found');
  sendSuccess(res, service);
});

/** GET /api/public/settings */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  sendSuccess(res, settings);
});

/* ------------------------------------------------------------------ *
 * Public POST - leads (rate-limited + zod-validated upstream)
 * ------------------------------------------------------------------ */

/** POST /api/public/quote */
export const createQuote = asyncHandler(async (req, res) => {
  const data = sanitizeDeep(req.body);
  const quote = await Quote.create({
    service: data.service || '',
    quantity: data.quantity || '',
    email: data.email,
  });
  sendSuccess(res, { id: quote._id }, 'Quote request received', 201);
});

/** POST /api/public/contact */
export const createContact = asyncHandler(async (req, res) => {
  const data = sanitizeDeep(req.body);
  const message = await Message.create({
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    service: data.service || '',
    message: data.message,
  });
  sendSuccess(res, { id: message._id }, 'Message received', 201);
});

/** POST /api/public/free-test (multipart: up to 5 images, 5 MB each) */
export const createFreeTest = asyncHandler(async (req, res) => {
  if (!cloudinaryConfigured) {
    throw new ApiError(503, 'File uploads are temporarily unavailable, please try again later');
  }

  const files = req.files || [];
  if (files.length === 0) {
    throw new ApiError(400, 'Please attach at least one image (max 5)');
  }

  const data = sanitizeDeep(req.body);
  const uploaded = [];

  try {
    for (const file of files) {
      const result = await uploadBuffer(file.buffer, 'pro-retouching/free-tests');
      uploaded.push({ url: result.url, publicId: result.publicId });
    }
  } catch (error) {
    // Roll back any files that were already uploaded
    await Promise.all(uploaded.map((file) => destroyAsset(file.publicId).catch(() => null)));
    throw new ApiError(502, `Failed to upload files: ${error.message}`);
  }

  const freeTest = await FreeTest.create({
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp || '',
    service: data.service || '',
    files: uploaded,
  });

  sendSuccess(
    res,
    { id: freeTest._id, files: uploaded },
    'Free test request received',
    201
  );
});

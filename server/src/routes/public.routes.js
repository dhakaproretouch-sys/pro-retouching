import { Router } from 'express';
import {
  listSlides,
  listServices,
  getServiceBySlug,
  listWorks,
  listPricing,
  listStats,
  listLogos,
  listFaqs,
  listTestimonials,
  getSettings,
  createQuote,
  createContact,
  createFreeTest,
} from '../controllers/public.controller.js';
import { validate } from '../middleware/validate.js';
import {
  quoteCreateSchema,
  contactCreateSchema,
  freeTestCreateSchema,
} from '../validators/schemas.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { uploadImages } from '../middleware/upload.js';

const router = Router();

/* Public content (GET only, no auth) */
router.get('/slides', listSlides);
router.get('/services', listServices);
router.get('/services/:slug', getServiceBySlug);
router.get('/works', listWorks);
router.get('/pricing', listPricing);
router.get('/stats', listStats);
router.get('/logos', listLogos);
router.get('/faqs', listFaqs);
router.get('/testimonials', listTestimonials);
router.get('/settings', getSettings);

/* Public POST (leads) - rate-limited + validated */
router.post('/quote', strictLimiter, validate({ body: quoteCreateSchema }), createQuote);
router.post('/contact', strictLimiter, validate({ body: contactCreateSchema }), createContact);
router.post(
  '/free-test',
  strictLimiter,
  uploadImages.array('files', 5),
  validate({ body: freeTestCreateSchema }),
  createFreeTest
);

export default router;

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { adminUpload } from '../controllers/upload.controller.js';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { validate } from '../middleware/validate.js';
import {
  settingsUpdateSchema,
  messageReadSchema,
  idParamSchema,
  exportTypeSchema,
} from '../validators/schemas.js';
import { createCrudRouter } from '../controllers/crud.factory.js';
import {
  HeroSlide,
  Service,
  Work,
  PricingPlan,
  Stat,
  ClientLogo,
  FAQ,
  Testimonial,
} from '../models/index.js';
import {
  heroSlideCreateSchema,
  heroSlideUpdateSchema,
  serviceCreateSchema,
  serviceUpdateSchema,
  workCreateSchema,
  workUpdateSchema,
  pricingPlanCreateSchema,
  pricingPlanUpdateSchema,
  statCreateSchema,
  statUpdateSchema,
  clientLogoCreateSchema,
  clientLogoUpdateSchema,
  faqCreateSchema,
  faqUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
} from '../validators/schemas.js';
import {
  quotesRouter,
  freeTestsRouter,
  messagesRouter,
  markMessageRead,
  getStats,
  exportCsv,
} from '../controllers/inbox.controller.js';

const router = Router();

/* All /api/admin routes require auth */
router.use(requireAuth);

/* ---- Dashboard stats + Export (must come before the /site-stats CRUD) ---- */
router.get('/stats', getStats);
router.get('/export/:type', validate({ params: exportTypeSchema }), exportCsv);

/* ---- Content CRUD ---- */
router.use(
  '/slides',
  createCrudRouter({
    Model: HeroSlide,
    name: 'Hero slide',
    imageFields: ['image'],
    searchableFields: ['alt'],
    createSchema: heroSlideCreateSchema,
    updateSchema: heroSlideUpdateSchema,
  })
);

router.use(
  '/services',
  createCrudRouter({
    Model: Service,
    name: 'Service',
    imageFields: ['image', 'beforeImage', 'afterImage'],
    searchableFields: ['title', 'slug', 'shortDesc'],
    slugField: 'slug',
    createSchema: serviceCreateSchema,
    updateSchema: serviceUpdateSchema,
  })
);

router.use(
  '/works',
  createCrudRouter({
    Model: Work,
    name: 'Work',
    imageFields: ['beforeImage', 'afterImage'],
    searchableFields: ['title', 'category'],
    createSchema: workCreateSchema,
    updateSchema: workUpdateSchema,
  })
);

router.use(
  '/pricing',
  createCrudRouter({
    Model: PricingPlan,
    name: 'Pricing plan',
    searchableFields: ['name'],
    createSchema: pricingPlanCreateSchema,
    updateSchema: pricingPlanUpdateSchema,
  })
);

router.use(
  '/site-stats',
  createCrudRouter({
    Model: Stat,
    name: 'Stat',
    searchableFields: ['label'],
    createSchema: statCreateSchema,
    updateSchema: statUpdateSchema,
  })
);

router.use(
  '/logos',
  createCrudRouter({
    Model: ClientLogo,
    name: 'Client logo',
    imageFields: ['image'],
    searchableFields: ['name'],
    createSchema: clientLogoCreateSchema,
    updateSchema: clientLogoUpdateSchema,
  })
);

router.use(
  '/faqs',
  createCrudRouter({
    Model: FAQ,
    name: 'FAQ',
    searchableFields: ['question'],
    createSchema: faqCreateSchema,
    updateSchema: faqUpdateSchema,
  })
);

router.use(
  '/testimonials',
  createCrudRouter({
    Model: Testimonial,
    name: 'Testimonial',
    searchableFields: ['name', 'role'],
    createSchema: testimonialCreateSchema,
    updateSchema: testimonialUpdateSchema,
  })
);

/* ---- Settings ---- */
router.get('/settings', getSettings);
router.put('/settings', validate({ body: settingsUpdateSchema }), updateSettings);

/* ---- Upload ---- */
router.post('/upload', uploadImage.single('image'), adminUpload);

/* ---- Inbox (quotes, free-tests, messages) ---- */
router.use('/quotes', quotesRouter);
router.use('/free-tests', freeTestsRouter);
router.use('/messages', messagesRouter);
router.patch(
  '/messages/:id/read',
  validate({ params: idParamSchema, body: messageReadSchema }),
  markMessageRead
);

export default router;

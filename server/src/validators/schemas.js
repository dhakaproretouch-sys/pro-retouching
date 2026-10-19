import { z } from 'zod';
import mongoose from 'mongoose';
import { sanitizeString } from '../utils/sanitize.js';

/* ------------------------------------------------------------------ *
 * Shared primitives
 * ------------------------------------------------------------------ */

export const objectId = z
  .string()
  .refine((value) => mongoose.isValidObjectId(value), 'Invalid id');

/** Trimmed + HTML-stripped string. */
export const clean = z.string().trim().transform(sanitizeString);
/** Trimmed + sanitized string with a minimum length (clean is a ZodEffects, so .min() is unavailable). */
export function cleanMin(min, message = `Must be at least ${min} character(s)`) {
  return clean.refine((value) => value.length >= min, { message });
}
export const cleanOrEmpty = z.string().trim().transform(sanitizeString).default('');
export const optionalClean = clean.optional();
export const orderField = z.coerce.number().int().optional();
export const isActiveField = z.boolean().optional();
export const stringArray = z.array(z.string().trim().transform(sanitizeString)).default([]);

const emailField = z.string().trim().toLowerCase().email('Invalid email address');

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

/* ------------------------------------------------------------------ *
 * Public POST bodies (strings are sanitized)
 * ------------------------------------------------------------------ */

export const quoteCreateSchema = z.object({
  service: cleanOrEmpty,
  quantity: cleanOrEmpty,
  email: emailField,
});

export const contactCreateSchema = z.object({
  name: cleanMin(1, 'Name is required'),
  email: emailField,
  phone: cleanOrEmpty,
  service: cleanOrEmpty,
  message: cleanMin(1, 'Message is required'),
});

export const freeTestCreateSchema = z.object({
  name: cleanMin(1, 'Name is required'),
  email: emailField,
  whatsapp: cleanOrEmpty,
  service: cleanOrEmpty,
});

/* ------------------------------------------------------------------ *
 * Admin CRUD schemas (per model)
 * ------------------------------------------------------------------ */

export const heroSlideCreateSchema = z.object({
  image: cleanMin(1, 'Image is required'),
  publicId: z.string().trim().default(''),
  alt: cleanMin(1, 'Alt text is required'),
  order: orderField,
  isActive: isActiveField,
});
export const heroSlideUpdateSchema = heroSlideCreateSchema.partial();

export const serviceCreateSchema = z.object({
  title: cleanMin(1, 'Title is required'),
  slug: z.string().trim().toLowerCase().optional(),
  shortDesc: cleanOrEmpty,
  description: cleanOrEmpty,
  bullets: stringArray,
  image: cleanOrEmpty,
  beforeImage: cleanOrEmpty,
  afterImage: cleanOrEmpty,
  order: orderField,
  isActive: isActiveField,
});
export const serviceUpdateSchema = serviceCreateSchema.partial();

export const workCreateSchema = z.object({
  title: cleanMin(1, 'Title is required'),
  category: cleanOrEmpty,
  beforeImage: cleanOrEmpty,
  afterImage: cleanOrEmpty,
  order: orderField,
  isActive: isActiveField,
});
export const workUpdateSchema = workCreateSchema.partial();

export const pricingPlanCreateSchema = z.object({
  name: cleanMin(1, 'Name is required'),
  price: cleanMin(1, 'Price is required'),
  unit: cleanOrEmpty,
  features: stringArray,
  isPopular: z.boolean().optional(),
  order: orderField,
});
export const pricingPlanUpdateSchema = pricingPlanCreateSchema.partial();

export const statCreateSchema = z.object({
  label: cleanMin(1, 'Label is required'),
  value: z.coerce.number({ invalid_type_error: 'Value must be a number' }).finite(),
  suffix: cleanOrEmpty,
  order: orderField,
});
export const statUpdateSchema = statCreateSchema.partial();

export const clientLogoCreateSchema = z.object({
  name: cleanMin(1, 'Name is required'),
  image: cleanOrEmpty,
  order: orderField,
});
export const clientLogoUpdateSchema = clientLogoCreateSchema.partial();

export const faqCreateSchema = z.object({
  question: cleanMin(1, 'Question is required'),
  answer: cleanMin(1, 'Answer is required'),
  order: orderField,
});
export const faqUpdateSchema = faqCreateSchema.partial();

export const testimonialCreateSchema = z.object({
  name: cleanMin(1, 'Name is required'),
  role: cleanOrEmpty,
  text: cleanMin(1, 'Text is required'),
  order: orderField,
});
export const testimonialUpdateSchema = testimonialCreateSchema.partial();

/* ------------------------------------------------------------------ *
 * Site settings
 * ------------------------------------------------------------------ */

const whyChooseItem = z.object({
  title: cleanMin(1),
  desc: cleanOrEmpty,
});

const priceHighlightItem = z.object({
  title: cleanMin(1),
  value: cleanMin(1),
  subtext: cleanOrEmpty,
});

export const settingsUpdateSchema = z
  .object({
    siteName: clean.optional(),
    tagline: clean.optional(),
    phone: clean.optional(),
    whatsapp: clean.optional(),
    email: clean.optional(),
    address: clean.optional(),
    social: z
      .object({
        facebook: cleanOrEmpty.optional(),
        linkedin: cleanOrEmpty.optional(),
        skype: cleanOrEmpty.optional(),
        whatsapp: cleanOrEmpty.optional(),
      })
      .optional(),
    footerText: clean.optional(),
    aboutText: clean.optional(),
    whyChoose: z.array(whyChooseItem).optional(),
    priceHighlights: z.array(priceHighlightItem).optional(),
  })
  .strict();

/* ------------------------------------------------------------------ *
 * Admin list / inbox queries
 * ------------------------------------------------------------------ */

export const listQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export const inboxQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export const quoteStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'done']),
});

export const freeTestStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'done']),
});

export const messageReadSchema = z.object({
  isRead: z.boolean(),
});

export const idParamSchema = z.object({ id: objectId });

export const reorderSchema = z
  .array(
    z.object({
      id: objectId,
      order: z.coerce.number().int(),
    })
  )
  .min(1, 'Provide at least one { id, order } entry')
  .max(500, 'Too many entries');

export const exportTypeSchema = z.object({
  type: z.enum([
    'quotes',
    'free-tests',
    'messages',
    'slides',
    'services',
    'works',
    'pricing',
    'stats',
    'logos',
    'faqs',
    'testimonials',
  ]),
});

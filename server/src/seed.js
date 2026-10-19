/**
 * Seed script: `npm run seed`
 *
 * - Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD (skips if it exists)
 * - Inserts the default website content copied from the frontend data files
 *   (src/data/constants.ts + src/data/heroSlides.js) so the site looks identical
 *   at first.
 *
 * Safe to run twice (or many times): everything is upserted on a unique key,
 * so no duplicates are ever created.
 */
import bcrypt from 'bcryptjs';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import {
  Admin,
  HeroSlide,
  Service,
  Work,
  PricingPlan,
  Stat,
  ClientLogo,
  FAQ,
  Testimonial,
  SiteSettings,
} from './models/index.js';

/* ------------------------------------------------------------------ *
 * Default content (mirrors src/data/constants.ts and heroSlides.js)
 * ------------------------------------------------------------------ */

const HERO_SLIDES = [
  { image: '/images/hero1.jpeg', alt: 'E-commerce product photo editing' },
  { image: '/images/hero2.jpeg', alt: 'Ghost mannequin and neck joint service' },
  { image: '/images/hero3.png', alt: 'Professional photo retouching studio' },
];

const ASSET_HERO = '/images/hero.jpg';
const ASSET_STUDIO = '/images/studio.jpg';
const ASSET_SWEATER = '/images/sweater.jpg';
const ASSET_SNEAKER = '/images/sneaker.jpg';
const ASSET_BOTTLE = '/images/bottle.jpg';

const SERVICES = [
  {
    slug: 'image-post-production',
    title: 'Image Post Production',
    shortDesc: 'Complete commercial photo refinement, RAW processing, catalog uniformity, and e-commerce ready deliverables.',
    description: 'Our comprehensive image post-production service covers end-to-end photo processing for top-tier retailers. From camera RAW conversion and chromatic aberration removal to exposure balancing, skin smoothing, dust cleaning, and multi-format web optimization, we ensure every product looks pristine across marketplace feeds.',
    bullets: [
      'RAW development and color temperature balancing',
      'Imperfection removal, scratch and lint cleanup',
      'Marketplace compliant white and pure-gray background standards',
      'Consistent product alignment, margin ratios, and web compression',
    ],
    image: ASSET_HERO,
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
  },
  {
    slug: 'ghost-mannequin',
    title: 'Ghost Mannequin / Neck Joint',
    shortDesc: 'Invisible hollow-man 3D effect seamlessly combining front, neck, inner lining, and sleeve openings.',
    description: 'Ghost mannequin editing gives apparel a lifelike three-dimensional hollow look without showing a distracting live model or plastic mannequin. We expertly merge front shots, interior back collar labels, and hem linings to create flawless, symmetrical e-commerce garment presentations that boost buyer confidence.',
    bullets: [
      'Neck joint insertion with label and collar stitching preservation',
      'Sleeve, cuff, and bottom hem 3D depth alignment',
      'Symmetry correction, wrinkle smoothing, and shape warping',
      'Natural internal drop shadow for realistic fabric depth',
    ],
    image: ASSET_SWEATER,
    beforeImage: ASSET_SWEATER,
    afterImage: ASSET_SWEATER,
  },
  {
    slug: 'background-removal',
    title: 'Background Removal',
    shortDesc: 'Precision manual Pen Tool clipping paths to isolate products on pure white, transparent, or custom scenes.',
    description: 'Never settle for rough automated AI cutout artifacts. Our senior Photoshop artisans hand-draw 100% manual Pen Tool bezier paths around every curve, edge, and hole. We guarantee feather-smooth, razor-sharp outlines ready for Amazon, eBay, Shopify, and Google Shopping specifications.',
    bullets: [
      '100% hand-drawn vector Pen Tool clipping paths',
      'Clean isolation around complex hardware and transparent materials',
      'Amazon FBA approved pure white background (RGB 255, 255, 255)',
      'High-resolution PNG transparent cutouts with alpha channels',
    ],
    image: ASSET_SNEAKER,
    beforeImage: ASSET_SNEAKER,
    afterImage: ASSET_SNEAKER,
  },
  {
    slug: 'photo-retouching',
    title: 'Photo Retouching',
    shortDesc: 'High-end product and beauty retouching, surface polish, scratch removal, and texture preservation.',
    description: 'Whether you sell luxury jewelry, leather goods, footwear, or cosmetics, minor studio scratches and fingerprints destroy conversion rates. Our photo retouching service cleans blemishes, smooths metal surfaces, restores fabric weaves, and sharpens critical product details without looking artificial or over-processed.',
    bullets: [
      'Dust, lint, scratch, and fingerprint elimination',
      'Leather texture enhancement and wrinkle reduction',
      'Diamond and gemstone brilliance enhancement',
      'Frequency separation for natural skin smoothing',
    ],
    image: ASSET_BOTTLE,
    beforeImage: ASSET_BOTTLE,
    afterImage: ASSET_BOTTLE,
  },
  {
    slug: 'color-correction',
    title: 'Color Correction & Recoloring',
    shortDesc: 'Accurate color matching, pantone alignment, and digital variant recoloring from a single master shot.',
    description: 'Product returns due to inaccurate colors cost e-commerce merchants millions every year. Pro Retouching colorists calibrate your product imagery against physical Pantone swatches and fabric color cards. We also generate dozens of colorway variants digitally from a single master photo, saving immense photo shoot budgets.',
    bullets: [
      'True-to-life Pantone and Hex swatch color matching',
      'Multi-color variant generation from a single base photograph',
      'Exposure and white balance calibration across bulk catalogs',
      'Pattern overlay and fabric tone consistency',
    ],
    image: ASSET_HERO,
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
  },
  {
    slug: 'shadow-reflection',
    title: 'Shadow & Reflection Creation',
    shortDesc: 'Natural drop shadows, original shadow preservation, floating shadows, and glossy mirror reflections.',
    description: 'Floating products look detached and amateur. Our team crafts realistic dimensional drop shadows, directional sun casts, and mirror reflections that anchor items naturally to the floor. We can preserve existing studio ground shadows or build custom soft-diffused shadows from scratch.',
    bullets: [
      'Natural drop shadow and contact shadow creation',
      'Original studio lighting shadow preservation',
      'High-end mirror and glass surface reflections',
      'Adjustable opacity, blur radius, and light angles',
    ],
    image: ASSET_BOTTLE,
    beforeImage: ASSET_BOTTLE,
    afterImage: ASSET_BOTTLE,
  },
  {
    slug: 'clipping-path',
    title: 'Image Cut-out / Clipping Path',
    shortDesc: 'Handmade vector clipping paths for simple, medium, complex, and super-complex items.',
    description: 'From simple geometric packaging to intricate bicycles, chain necklaces, and wire mesh furniture, we provide multi-path clipping paths that allow art directors to isolate individual parts and materials with zero loss of vector sharpness.',
    bullets: [
      'Simple to super-complex multi-path layering',
      'Zero automated algorithms — 100% human-crafted accuracy',
      'Embedded Photoshop clipping paths (EPS/TIFF/PSD)',
      'Accurate edge compensation preventing fringing',
    ],
    image: ASSET_SNEAKER,
    beforeImage: ASSET_SNEAKER,
    afterImage: ASSET_SNEAKER,
  },
  {
    slug: 'neck-joint',
    title: 'Neck Joint Service',
    shortDesc: 'Dedicated collar and neckline replacement for apparel brands and fashion catalog workflows.',
    description: 'A specialized sub-service of ghost mannequin where our editors attach inner collar tags, size prints, and interior neck fabrics with realistic textile folds and lighting.',
    bullets: [
      'Collar tag alignment and perspective correction',
      'Lining tone and pattern matching',
      'Removal of model hair and neck interference',
      'Crisp edge transitions on delicate knitwear',
    ],
    image: ASSET_SWEATER,
    beforeImage: ASSET_SWEATER,
    afterImage: ASSET_SWEATER,
  },
  {
    slug: 'image-masking',
    title: 'Image Masking',
    shortDesc: 'Alpha channel, hair masking, fur, and transparent fabric isolation where Pen Tool cannot reach.',
    description: 'Fine flyaway model hair, animal fur coats, chiffon gowns, and semi-transparent smoke or glass require advanced channel masking and refinement techniques. We extract every strand without leaving halos or muddy outlines.',
    bullets: [
      'Advanced hair and fur strand isolation',
      'Alpha channel and color range masking',
      'Preservation of semi-transparent organza, tulle, and veil fabrics',
      'Edge defringing and background color contamination removal',
    ],
    image: ASSET_HERO,
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
  },
  {
    slug: 'raster-to-vector',
    title: 'Raster to Vector Conversion',
    shortDesc: 'Redrawing low-resolution logos, product schematics, and artwork into infinitely scalable SVG/AI vector files.',
    description: 'Turn pixelated JPEG and PNG logos, badges, technical drawings, and sketches into clean, infinitely scalable vector artwork. Every line, gradient, and anchor point is plotted manually by vector illustration artists.',
    bullets: [
      'Manual vector tracing in Adobe Illustrator',
      'Scalable EPS, SVG, PDF, and AI delivery files',
      'Font matching or custom vector letter recreation',
      'Color separation for screen printing and embroidery',
    ],
    image: ASSET_HERO,
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    shortDesc: 'Amazon A+ content, lifestyle banners, product infographics, and e-commerce marketing collaterals.',
    description: 'Elevate your conversion rate with persuasive visual marketing assets: Amazon EBC / A+ modules, benefit callout infographics, dimension overlays, and social media advertising creatives.',
    bullets: [
      'Amazon A+ Content and Brand Story modules',
      'Feature callout infographics and dimension diagrams',
      'Hero banners for Shopify and promotional landing pages',
      'Consistent typography, icons, and brand palette',
    ],
    image: ASSET_HERO,
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
  },
  {
    slug: 'video-editing',
    title: 'E-commerce Video Editing',
    shortDesc: 'Polished 360-spin video trimming, color grading, pacing, and engaging shorts for TikTok, Reels & Amazon.',
    description: 'Modern shoppers buy motion. We edit product unboxing videos, 360 turntable spins, social video ads, and Amazon video hero headers with clean cuts, captions, smooth transitions, and background audio.',
    bullets: [
      '360-degree turntable video stabilization and speed ramping',
      'Social-first aspect ratios (9:16, 1:1, 16:9)',
      'Subtitle synchronization and feature callout text',
      'Color grading matching product catalog photos',
    ],
    image: ASSET_HERO,
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
  },
  {
    slug: '3d-product-modeling',
    title: '3D Product Modeling & Rendering',
    shortDesc: 'Photorealistic 3D CAD modeling, texturing, and angle rendering before physical production starts.',
    description: 'Create realistic 3D product renders from photos or CAD drawings. Render limitless photorealistic angles, exploded views, and packaging renders without shipping physical prototypes to a photo studio.',
    bullets: [
      'High-poly 3D modeling and UV mapping',
      'PBR material texturing (glass, metals, fabrics, plastics)',
      'Studio virtual lighting setups and 4K renders',
      'Interactive 3D GLTF / USDZ formats for web AR',
    ],
    image: ASSET_BOTTLE,
    beforeImage: ASSET_BOTTLE,
    afterImage: ASSET_BOTTLE,
  },
  {
    slug: 'web-development',
    title: 'E-commerce Web Development',
    shortDesc: 'Custom Shopify, WooCommerce, and headless e-commerce frontend development for modern brands.',
    description: 'Complementing our visual services, our web engineers build high-performance e-commerce storefronts on Shopify, WooCommerce, and modern React stacks optimized for lightning-fast conversions.',
    bullets: [
      'Custom Shopify theme design and customization',
      'Speed optimization achieving 90+ Google PageSpeed scores',
      'Mobile-first responsive architecture',
      'Conversion rate optimization (CRO) checkout flows',
    ],
    image: ASSET_STUDIO,
    beforeImage: ASSET_STUDIO,
    afterImage: ASSET_STUDIO,
  },
];

const PRICING_PLANS = [
  {
    name: 'Basic Clipping Path',
    price: '$0.25',
    unit: 'per image',
    isPopular: false,
    features: [
      '100% Hand-Drawn Pen Tool Paths',
      'Pure White or Transparent PNG',
      '12-24 Hours Turnaround',
      'Simple Geometric Shapes',
      'Free Revisions Included',
      'Web Optimized File Formats',
    ],
  },
  {
    name: 'Photo Retouching',
    price: '$0.75',
    unit: 'per image',
    isPopular: true,
    features: [
      'Dust, Scratch & Blemish Removal',
      'Skin & Fabric Smoothing',
      'Natural Drop Shadow or Reflection',
      'Color Calibration & Matching',
      'Clipping Path Included',
      'Priority 12-Hour Turnaround',
      'Unlimited Free Revisions',
    ],
  },
  {
    name: 'Ghost Mannequin / 3D',
    price: '$0.80',
    unit: 'per image',
    isPopular: false,
    features: [
      'Front & Back Collar Joint Merging',
      'Sleeve & Hem Depth Alignment',
      'Wrinkle Smoothing & Shape Correction',
      'Internal Fabric Shadow Creation',
      'Pure White Background Included',
      'Brand Label Preservation',
      '24-Hour Delivery Guarantee',
    ],
  },
];

// src/data/constants.ts → SNEAK_PEEK_COUNTERS
const STATS = [
  { value: 50, suffix: '+', label: 'Expert Designers' },
  { value: 100000, suffix: '+', label: 'Images Processed' },
  { value: 500, suffix: '+', label: 'Projects Finished' },
  { value: 100, suffix: '+', label: 'Happy Clients' },
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 10000, suffix: '+', label: 'Hours of Work' },
];

// src/data/constants.ts → MARKETPLACE_LOGOS (image filled in later via the admin)
const CLIENT_LOGOS = [
  { name: 'Amazon', image: '' },
  { name: 'eBay', image: '' },
  { name: 'Shopify', image: '' },
  { name: 'Etsy', image: '' },
  { name: 'Walmart', image: '' },
  { name: 'Fiverr', image: '' },
];

// src/data/constants.ts → FAQ_ITEMS
const FAQS = [
  {
    question: 'How do I send my test images for the Free Trial?',
    answer: "You can submit 2 to 3 sample photos directly through our 'Free Test' page using our drag-and-drop uploader. Alternatively, you can share a Dropbox, Google Drive, WeTransfer, or OneDrive link. We will retouch them and send them back within 12 hours with zero commitment.",
  },
  {
    question: 'What is your typical turnaround time?',
    answer: 'Our standard delivery time is 12 to 24 hours for batches up to 500 images. For urgent deadlines, we offer an expedited 4-hour or 8-hour rush turnaround. Because our studio operates 3 shifts per day (24/5), work continues while your local team sleeps.',
  },
  {
    question: 'Do you use automated AI tools or real human editors?',
    answer: 'All clipping paths, ghost mannequin joints, and high-end retouching are 100% hand-crafted by professional graphic designers using Adobe Photoshop and Wacom tablets. Automated AI tools often chew edges, blur textures, and miss intricate details; our human precision ensures marketplace-ready results every time.',
  },
  {
    question: 'How are my files and intellectual property protected?',
    answer: 'We sign strict Non-Disclosure Agreements (NDAs) with all clients. Your files are stored on secure encrypted storage and are never published, shared with third parties, or used in our public portfolio without your explicit written authorization.',
  },
  {
    question: 'What payment methods and invoicing terms do you accept?',
    answer: 'We accept PayPal, Stripe, major Credit Cards, Payoneer, and Direct Bank Wire Transfers (USD, EUR, GBP). For ongoing clients with regular image volume, we offer flexible weekly or monthly post-paid invoices.',
  },
  {
    question: 'What happens if I need revisions on edited images?',
    answer: 'We provide 100% free unlimited revisions until you are completely satisfied with the results. Simply reply to our delivery email or ping us on WhatsApp/Skype with your feedback.',
  },
];

// src/data/constants.ts → PORTFOLIO_WORKS
const WORKS = [
  { title: 'Luxury Leather Handbag', category: 'Clipping Path', image: ASSET_HERO },
  { title: 'Cable Knit Crewneck Sweater', category: 'Ghost Mannequin', image: ASSET_SWEATER },
  { title: 'Urban Designer Sneaker', category: 'Retouching', image: ASSET_SNEAKER },
  { title: 'Organic Serum Bottle', category: 'Shadow', image: ASSET_BOTTLE },
  { title: 'Fashion Studio Retouching Suite', category: 'Color Correction', image: ASSET_STUDIO },
  { title: 'Designer Sunglasses & Accessories', category: 'Clipping Path', image: ASSET_HERO },
];

// src/data/constants.ts → COMPANY_INFO + WHY_CHOOSE_ITEMS + PRICE_STATS_STRIP
const SITE_SETTINGS = {
  key: 'site',
  siteName: 'Pro Retouching',
  tagline: 'Effortless Image Editing for E-commerce',
  phone: '+880 1712-345678',
  whatsapp: '+8801712345678',
  email: 'support@proretouching.com',
  address: 'House 42, Road 11, Sector 4, Uttara, Dhaka-1230, Bangladesh',
  social: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    skype: 'live:proretouching_bd',
    whatsapp: '+8801712345678',
  },
  footerText:
    'Effortless Image Editing for E-commerce. High-volume, hand-crafted image and video post-production for global e-commerce sellers, Amazon merchants, and fashion houses.',
  aboutText:
    'Founded with a mission to bridge the gap between expensive Western production studios and slow, unreliable freelancing networks, Pro Retouching operates as an integrated offshore production extension for global retailers, photo studios, and creative agencies.',
  whyChoose: [
    { title: '20–50% Cost Saving', desc: 'Competitive offshore pricing from Bangladesh compared to in-house studio overheads.' },
    { title: 'Faster Turnaround', desc: 'Guaranteed 12–24 hour delivery with an optional 4-hour expedited rush protocol.' },
    { title: '3 Working Shifts a Day', desc: 'Continuous round-the-clock workflow keeping projects active across all time zones.' },
    { title: '24/5 Production & Support', desc: 'Live dedicated project managers available via Skype, WhatsApp, and phone.' },
    { title: '3-Step Quality Control', desc: 'Every image passes designer review, QC lead inspection, and final director sign-off.' },
    { title: 'Monthly Payment System', desc: 'Flexible net-30 terms and consolidated monthly billing for verified enterprise accounts.' },
    { title: 'High-Speed Internet', desc: 'Dual gigabit fiber optic uplinks ensuring lightning-fast bulk image uploads & downloads.' },
    { title: 'Latest Software Versions', desc: 'Adobe Creative Cloud 2026, Capture One Pro, and calibrated Wacom Cintiq displays.' },
    { title: 'Strict Deadlines Adherence', desc: '99.8% on-time delivery record backed by our service level agreement (SLA).' },
    { title: 'Dedicated Team for Big Projects', desc: 'Reserved pod of designers trained specifically on your brand style guidelines.' },
    { title: 'NDA for File Privacy', desc: 'Legally binding non-disclosure agreements, encrypted servers, and zero unauthorized usage.' },
    { title: 'Free Revisions & Reworks', desc: 'Unlimited complimentary retouching adjustments until you are 100% satisfied.' },
  ],
  priceHighlights: [
    { title: 'Starting Price', value: '$0.25', subtext: 'Per image clipping path with multi-tier pricing' },
    { title: 'Bulk Discount', value: 'Up to 30%', subtext: 'Volume savings on bulk e-commerce catalog batches' },
    { title: 'Daily Capacity', value: '2,000 Images', subtext: 'High-capacity multi-shift production facility' },
    { title: 'Support', value: '24/5', subtext: 'Round-the-clock support via Email, Mobile & WhatsApp' },
  ],
};

/* ------------------------------------------------------------------ *
 * Seed helpers
 * ------------------------------------------------------------------ */

const created = [];
const existing = [];

async function upsert(Model, label, filter, data) {
  const result = await Model.updateOne(filter, { $set: data }, { upsert: true });
  if (result.upsertedCount > 0) created.push(label);
  else existing.push(label);
  return result;
}

async function seedAdmin() {
  const email = (env.ADMIN_EMAIL || '').toLowerCase().trim();
  if (!email) throw new Error('ADMIN_EMAIL is not set in server/.env');

  const found = await Admin.findOne({ email }).select('+passwordHash');
  if (found) {
    existing.push(`admin (${email})`);
    return;
  }

  const password = env.ADMIN_PASSWORD;
  if (!password || password.length < 6) {
    throw new Error(
      'ADMIN_PASSWORD is missing or too short (min 6 chars). Set it in server/.env, then re-run `npm run seed`.'
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash });
  created.push(`admin (${email})`);
}

async function run() {
  console.log('🌱 Seeding database...\n');
  await connectDB();

  // 1. Admin account
  await seedAdmin();

  // 2. Hero slides
  for (const [index, slide] of HERO_SLIDES.entries()) {
    await upsert(HeroSlide, `heroSlide: ${slide.image}`, { image: slide.image }, {
      image: slide.image,
      publicId: '',
      alt: slide.alt,
      order: index + 1,
      isActive: true,
    });
  }

  // 3. Services
  for (const [index, service] of SERVICES.entries()) {
    await upsert(Service, `service: ${service.slug}`, { slug: service.slug }, {
      ...service,
      order: index + 1,
      isActive: true,
    });
  }

  // 4. Pricing plans
  for (const [index, plan] of PRICING_PLANS.entries()) {
    await upsert(PricingPlan, `pricingPlan: ${plan.name}`, { name: plan.name }, {
      ...plan,
      order: index + 1,
    });
  }

  // 5. Stats
  for (const [index, stat] of STATS.entries()) {
    await upsert(Stat, `stat: ${stat.label}`, { label: stat.label }, {
      ...stat,
      order: index + 1,
    });
  }

  // 6. Client logos
  for (const [index, logo] of CLIENT_LOGOS.entries()) {
    await upsert(ClientLogo, `clientLogo: ${logo.name}`, { name: logo.name }, {
      ...logo,
      order: index + 1,
    });
  }

  // 7. FAQ
  for (const [index, faq] of FAQS.entries()) {
    await upsert(FAQ, `faq: ${faq.question}`, { question: faq.question }, {
      ...faq,
      order: index + 1,
    });
  }

  // 8. Portfolio works
  for (const [index, work] of WORKS.entries()) {
    await upsert(Work, `work: ${work.title}`, { title: work.title }, {
      title: work.title,
      category: work.category,
      beforeImage: work.image,
      afterImage: work.image,
      order: index + 1,
      isActive: true,
    });
  }

  // 9. Site settings (single document)
  await upsert(SiteSettings, 'siteSettings', { key: 'site' }, SITE_SETTINGS);

  // 10. Testimonials: no default content in the frontend data files,
  //     so the collection is left empty for the admin to fill in later.
  const testimonialCount = await Testimonial.countDocuments();

  console.log('──────────────────────────────────────────');
  console.log(`Created:  ${created.length}`);
  for (const item of created) console.log(`   + ${item}`);
  console.log(`Existing: ${existing.length} (skipped, no duplicates)`);
  console.log(`Testimonials in DB: ${testimonialCount} (seeded none - no default content)`);
  console.log('──────────────────────────────────────────');
  console.log('✨ Seed complete');

  await disconnectDB();
  process.exit(0);
}

run().catch(async (error) => {
  console.error('❌ Seed failed:', error.message);
  try {
    await disconnectDB();
  } catch {
    /* ignore */
  }
  process.exit(1);
});

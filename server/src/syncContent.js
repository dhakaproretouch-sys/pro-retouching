#!/usr/bin/env node
/**
 * Sync content script: `npm run sync:content`
 *
 * Updates ONLY content fields (title, shortDesc, description, bullets, alt, 
 * category, image paths) of existing Service, Work and HeroSlide records,
 * matched by slug/title.
 *
 * Safety features:
 * - never touch admin users, inbox data (quotes, free tests, messages), or settings
 * - never overwrite a record that was edited in the admin panel unless --force flag
 *   (compares updatedAt vs createdAt to detect edits)
 * - supports --dry-run flag that only prints what would change
 * - reads MONGO_URI from environment (works for both local and Atlas)
 * - safe to run twice
 */

import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { HeroSlide, Service, Work } from './models/index.js';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');

// Corrected content matching the fixed data
const HERO_SLIDES = [
  { image: '/images/hero-slide-1.jpg', alt: 'E-commerce product photo editing service showcase' },
  { image: '/images/hero-slide-2.jpg', alt: 'Ghost mannequin and neck joint apparel editing service' },
  { image: '/images/hero-slide-3.jpg', alt: 'Professional photo retouching studio workspace' },
];

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
    image: '/images/1690386320753.jpeg',
    beforeImage: '/images/1690386320753.jpeg',
    afterImage: '/images/1690386320753.jpeg',
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
    image: '/images/sweater.jpg',
    beforeImage: '/images/sweater.jpg',
    afterImage: '/images/sweater.jpg',
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
    image: '/images/1693144321140.jpeg',
    beforeImage: '/images/1693144321140.jpeg',
    afterImage: '/images/1693144321140.jpeg',
  },
  {
    slug: 'photo-retouching',
    title: 'Photo Retouching',
    shortDesc: 'High-end product and beauty retouching, surface polish, scratch removal, and texture preservation.',
    description: 'Whether you sell luxury jewelry, leather goods, footwear, or cosmetics, minor studio scratches and fingerprints destroy conversion rates. Our photo retouching service cleans blemishes, smooths metal surfaces, restores fabric weaves, and sharpens critical product details without looking artificial or over-processed.',
    bullets: [
      'Dust, lint, scratch, and fingerprint elimination',
      'Leather texture enhancement and wrinkle reduction',
      'Product surface polish and detail sharpening',
      'Natural-looking results with texture preservation',
    ],
    image: '/images/1698937341506.jpeg',
    beforeImage: '/images/1698937341506.jpeg',
    afterImage: '/images/1698937341506.jpeg',
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
      'Consistent color grading for catalog uniformity',
    ],
    image: '/images/1743090273681.jpeg',
    beforeImage: '/images/1743090273681.jpeg',
    afterImage: '/images/1743090273681.jpeg',
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
    image: '/images/1687185290899.jpeg',
    beforeImage: '/images/1687185290899.jpeg',
    afterImage: '/images/1687185290899.jpeg',
  },
  {
    slug: 'clipping-path',
    title: 'Image Cut-out / Clipping Path',
    shortDesc: 'Handmade vector clipping paths for simple, medium, complex, and super-complex items.',
    description: 'From simple geometric packaging to intricate products with fine details, we provide multi-path clipping paths that allow precise isolation with zero loss of detail. Every path is hand-drawn by skilled Photoshop artists.',
    bullets: [
      'Simple to complex multi-path layering',
      '100% human-crafted for maximum accuracy',
      'Clean edges with no fringing or artifacts',
      'Ready for any background or transparent output',
    ],
    image: '/images/1785505072566.jpeg',
    beforeImage: '/images/1785505072566.jpeg',
    afterImage: '/images/1785505072566.jpeg',
  },
  {
    slug: 'neck-joint',
    title: 'Neck Joint Service',
    shortDesc: 'Dedicated collar and neckline replacement for apparel brands and fashion catalog workflows.',
    description: 'A specialized service for apparel where we attach inner collar tags, size prints, and interior neck fabrics with realistic textile folds and lighting for a seamless ghost mannequin look.',
    bullets: [
      'Collar tag alignment and perspective correction',
      'Lining tone and pattern matching',
      'Natural fabric fold recreation',
      'Crisp edge transitions on delicate knitwear',
    ],
    image: '/images/1787750124564.jpeg',
    beforeImage: '/images/1787750124564.jpeg',
    afterImage: '/images/1787750124564.jpeg',
  },
  {
    slug: 'image-masking',
    title: 'Image Masking',
    shortDesc: 'Alpha channel, hair masking, fur, and transparent fabric isolation where Pen Tool cannot reach.',
    description: 'Fine flyaway model hair, animal fur coats, chiffon gowns, and semi-transparent fabrics require advanced channel masking techniques. We extract every strand without leaving halos or muddy outlines.',
    bullets: [
      'Advanced hair and fur strand isolation',
      'Alpha channel and color range masking',
      'Preservation of semi-transparent fabrics',
      'Clean edges with no halos or fringing',
    ],
    image: '/images/1788684056774.jpeg',
    beforeImage: '/images/1788684056774.jpeg',
    afterImage: '/images/1788684056774.jpeg',
  },
  {
    slug: 'raster-to-vector',
    title: 'Raster to Vector Conversion',
    shortDesc: 'Redrawing low-resolution logos, product schematics, and artwork into infinitely scalable SVG/AI vector files.',
    description: 'Turn pixelated JPEG and PNG logos, badges, and artwork into clean, infinitely scalable vector files. Every element is manually traced for maximum precision and scalability.',
    bullets: [
      'Manual vector tracing in Adobe Illustrator',
      'Scalable EPS, SVG, PDF, and AI delivery files',
      'Clean paths with precise anchor points',
      'Ready for print and web use',
    ],
    image: '/images/1789652964412.jpeg',
    beforeImage: '/images/1789652964412.jpeg',
    afterImage: '/images/1789652964412.jpeg',
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    shortDesc: 'Amazon A+ content, lifestyle banners, product infographics, and e-commerce marketing collaterals.',
    description: 'Elevate your conversion rate with persuasive visual marketing assets: Amazon A+ content modules, feature callouts, infographics, and promotional banners designed to drive sales.',
    bullets: [
      'Amazon A+ Content and Brand Story modules',
      'Feature callout infographics',
      'Banner designs for e-commerce platforms',
      'Brand-consistent design assets',
    ],
    image: '/images/1690386320753.jpeg',
    beforeImage: '/images/1690386320753.jpeg',
    afterImage: '/images/1690386320753.jpeg',
  },
  {
    slug: 'video-editing',
    title: 'E-commerce Video Editing',
    shortDesc: 'Polished 360-spin video trimming, color grading, pacing, and engaging shorts for TikTok, Reels & Amazon.',
    description: 'Modern shoppers buy motion. We edit product videos, 360-degree spins, and promotional clips with clean cuts, professional color grading, and platform-optimized formats.',
    bullets: [
      '360-degree product video editing',
      'Social media optimized formats',
      'Color grading and stabilization',
      'Clean, professional final output',
    ],
    image: '/images/1691595299886.jpeg',
    beforeImage: '/images/1691595299886.jpeg',
    afterImage: '/images/1691595299886.jpeg',
  },
  {
    slug: '3d-product-modeling',
    title: '3D Product Modeling & Rendering',
    shortDesc: 'Photorealistic 3D CAD modeling, texturing, and angle rendering before physical production starts.',
    description: 'Create realistic 3D product renders from photos or CAD drawings. Render photorealistic angles for e-commerce use without expensive photoshoots.',
    bullets: [
      'Photorealistic 3D modeling',
      'PBR material texturing',
      'Multiple angle renders',
      'High-resolution output files',
    ],
    image: '/images/1693144321140.jpeg',
    beforeImage: '/images/1693144321140.jpeg',
    afterImage: '/images/1693144321140.jpeg',
  },
  {
    slug: 'web-development',
    title: 'E-commerce Web Development',
    shortDesc: 'Custom Shopify, WooCommerce, and headless e-commerce frontend development for modern brands.',
    description: 'Our web development team builds high-performance e-commerce storefronts optimized for conversions, speed, and seamless user experience.',
    bullets: [
      'Custom e-commerce development',
      'Mobile-responsive design',
      'Performance optimization',
      'Conversion-focused implementation',
    ],
    image: '/images/1698937341506.jpeg',
    beforeImage: '/images/1698937341506.jpeg',
    afterImage: '/images/1698937341506.jpeg',
  },
];

const WORKS = [
  { title: 'Luxury Leather Handbag', category: 'Clipping Path', beforeImage: '/images/1690386320753.jpeg', afterImage: '/images/1690386320753.jpeg' },
  { title: 'Cable Knit Crewneck Sweater', category: 'Ghost Mannequin', beforeImage: '/images/sweater.jpg', afterImage: '/images/sweater.jpg' },
  { title: 'Urban Designer Sneaker', category: 'Retouching', beforeImage: '/images/1693144321140.jpeg', afterImage: '/images/1693144321140.jpeg' },
  { title: 'Organic Serum Bottle', category: 'Shadow', beforeImage: '/images/1698937341506.jpeg', afterImage: '/images/1698937341506.jpeg' },
  { title: 'Fashion Apparel Collection', category: 'Color Correction', beforeImage: '/images/1743090273681.jpeg', afterImage: '/images/1743090273681.jpeg' },
  { title: 'Designer Sunglasses', category: 'Clipping Path', beforeImage: '/images/1687185290899.jpeg', afterImage: '/images/1687185290899.jpeg' },
];

function isEdited(record) {
  if (!record.createdAt || !record.updatedAt) return false;
  const created = new Date(record.createdAt).getTime();
  const updated = new Date(record.updatedAt).getTime();
  // Consider edited if updated more than 1 second after creation
  return updated - created > 1000;
}

async function run() {
  console.log('🔄 Syncing content...\n');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'} ${FORCE ? '| FORCE (overwriting edited)' : ''}\n`);
  
  await connectDB();

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  // Sync Hero Slides
  console.log('📸 Hero Slides:');
  for (const slide of HERO_SLIDES) {
    const existing = await HeroSlide.findOne({ image: slide.image });
    if (!existing) {
      console.log(`  ⚠️  Not found: ${slide.image}`);
      notFound++;
      continue;
    }
    if (isEdited(existing) && !FORCE) {
      console.log(`  ⏭️  Skipped (edited in admin): ${slide.image} (updatedAt: ${existing.updatedAt})`);
      skipped++;
      continue;
    }
    const changes = [];
    if (existing.alt !== slide.alt) changes.push(`alt: "${existing.alt}" → "${slide.alt}"`);
    
    if (changes.length === 0) {
      console.log(`  ✓ ${slide.image} (no changes)`);
      continue;
    }
    
    console.log(`  ${DRY_RUN ? '🔍' : '✏️'} ${slide.image}:`);
    changes.forEach(c => console.log(`     ${c}`));
    
    if (!DRY_RUN) {
      await HeroSlide.updateOne({ _id: existing._id }, { $set: { alt: slide.alt } });
    }
    updated++;
  }

  // Sync Services
  console.log('\n🛠️  Services:');
  for (const service of SERVICES) {
    const existing = await Service.findOne({ slug: service.slug });
    if (!existing) {
      console.log(`  ⚠️  Not found: ${service.slug}`);
      notFound++;
      continue;
    }
    if (isEdited(existing) && !FORCE) {
      console.log(`  ⏭️  Skipped (edited in admin): ${service.slug} (updatedAt: ${existing.updatedAt})`);
      skipped++;
      continue;
    }
    const changes = [];
    if (existing.title !== service.title) changes.push(`title`);
    if (existing.shortDesc !== service.shortDesc) changes.push(`shortDesc`);
    if (existing.description !== service.description) changes.push(`description`);
    if (JSON.stringify(existing.bullets) !== JSON.stringify(service.bullets)) changes.push(`bullets`);
    if (existing.image !== service.image) changes.push(`image`);
    if (existing.beforeImage !== service.beforeImage) changes.push(`beforeImage`);
    if (existing.afterImage !== service.afterImage) changes.push(`afterImage`);
    
    if (changes.length === 0) {
      console.log(`  ✓ ${service.slug} (no changes)`);
      continue;
    }
    
    console.log(`  ${DRY_RUN ? '🔍' : '✏️'} ${service.slug}: ${changes.join(', ')}`);
    
    if (!DRY_RUN) {
      await Service.updateOne({ _id: existing._id }, { 
        $set: { 
          title: service.title,
          shortDesc: service.shortDesc,
          description: service.description,
          bullets: service.bullets,
          image: service.image,
          beforeImage: service.beforeImage,
          afterImage: service.afterImage,
        } 
      });
    }
    updated++;
  }

  // Sync Works
  console.log('\n🎨 Works:');
  for (const work of WORKS) {
    const existing = await Work.findOne({ title: work.title });
    if (!existing) {
      console.log(`  ⚠️  Not found: ${work.title}`);
      notFound++;
      continue;
    }
    if (isEdited(existing) && !FORCE) {
      console.log(`  ⏭️  Skipped (edited in admin): ${work.title} (updatedAt: ${existing.updatedAt})`);
      skipped++;
      continue;
    }
    const changes = [];
    if (existing.category !== work.category) changes.push(`category`);
    if (existing.beforeImage !== work.beforeImage) changes.push(`beforeImage`);
    if (existing.afterImage !== work.afterImage) changes.push(`afterImage`);
    
    if (changes.length === 0) {
      console.log(`  ✓ ${work.title} (no changes)`);
      continue;
    }
    
    console.log(`  ${DRY_RUN ? '🔍' : '✏️'} ${work.title}: ${changes.join(', ')}`);
    
    if (!DRY_RUN) {
      await Work.updateOne({ _id: existing._id }, { 
        $set: { 
          category: work.category,
          beforeImage: work.beforeImage,
          afterImage: work.afterImage,
        } 
      });
    }
    updated++;
  }

  console.log('\n──────────────────────────────────────────');
  console.log(`Updated:  ${updated}`);
  console.log(`Skipped:  ${skipped} (edited in admin, use --force to override)`);
  console.log(`Not found: ${notFound}`);
  console.log('──────────────────────────────────────────');
  if (DRY_RUN) {
    console.log('✨ Dry run complete - no changes made');
  } else {
    console.log('✨ Sync complete');
  }

  await disconnectDB();
  process.exit(0);
}

run().catch(async (error) => {
  console.error('❌ Sync failed:', error.message);
  try {
    await disconnectDB();
  } catch {
    /* ignore */
  }
  process.exit(1);
});

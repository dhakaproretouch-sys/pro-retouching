/**
 * Central source of truth for image-to-content mapping
 * Ensures every image matches its title, description, alt text and category
 */
export const IMAGE_MAP = {
  // Named/known images
  'hero.jpg': {
    filename: 'hero.jpg',
    title: 'E-commerce Product Collection',
    category: 'Hero',
    description: 'Premium e-commerce product collection prepared for professional photo editing, background removal, and catalog optimization.',
    alt: 'E-commerce product collection ready for professional photo retouching'
  },
  'hero-slide-1.jpg': {
    filename: 'hero-slide-1.jpg',
    title: 'E-commerce Product Photo Editing',
    category: 'Hero Slide',
    description: 'Professional e-commerce product photo editing with precision clipping paths and marketplace-ready enhancement.',
    alt: 'E-commerce product photo editing service showcase'
  },
  'hero-slide-2.jpg': {
    filename: 'hero-slide-2.jpg',
    title: 'Ghost Mannequin and Neck Joint Service',
    category: 'Hero Slide',
    description: 'Apparel presented with invisible ghost mannequin effect, seamless neck joint construction, and professional garment editing.',
    alt: 'Ghost mannequin and neck joint apparel editing service'
  },
  'hero-slide-3.jpg': {
    filename: 'hero-slide-3.jpg',
    title: 'Professional Photo Retouching Studio',
    category: 'Hero Slide',
    description: 'State-of-the-art photo retouching studio delivering high-volume, pixel-perfect e-commerce image post-production.',
    alt: 'Professional photo retouching studio workspace'
  },
  'hero1.jpeg': {
    filename: 'hero1.jpeg',
    title: 'E-commerce Catalog Products',
    category: 'Hero',
    description: 'Diverse e-commerce catalog products prepared for professional clipping paths, retouching, and marketplace optimization.',
    alt: 'E-commerce catalog products for photo editing'
  },
  'hero2.jpeg': {
    filename: 'hero2.jpeg',
    title: 'Clean Product Photography',
    category: 'Hero',
    description: 'Clean studio product photography ready for background removal, shadow creation, and catalog uniformity.',
    alt: 'Clean studio product photography for e-commerce'
  },
  'hero3.png': {
    filename: 'hero3.png',
    title: 'Multi-Category Product Showcase',
    category: 'Hero',
    description: 'Multi-category product showcase demonstrating professional photo editing across fashion, footwear, and accessories.',
    alt: 'Multi-category product showcase for photo editing services'
  },
  'studio.jpg': {
    filename: 'studio.jpg',
    title: 'Pro Retouching Studio',
    category: 'Studio',
    description: 'Professional in-house photo retouching studio with skilled Photoshop specialists delivering pixel-perfect e-commerce edits.',
    alt: 'Pro Retouching dedicated photo retouching studio workspace'
  },
  'sweater.jpg': {
    filename: 'sweater.jpg',
    title: 'Cable Knit Crewneck Sweater - Ghost Mannequin',
    category: 'Apparel',
    description: 'Cable knit crewneck sweater edited with ghost mannequin technique, seamless neck joint assembly, and natural fabric shape preservation.',
    alt: 'Cable knit crewneck sweater ghost mannequin editing'
  },
  'sneaker.jpg': {
    filename: 'sneaker.jpg',
    title: 'Urban Designer Sneaker',
    category: 'Footwear',
    description: 'Designer sneaker with sole cleaning, stitching enhancement, precision clipping path isolation, and natural shadow creation for e-commerce.',
    alt: 'Urban designer sneaker professional retouching and isolation'
  },
  'bottle.jpg': {
    filename: 'bottle.jpg',
    title: 'Cosmetic Serum Bottle',
    category: 'Cosmetics',
    description: 'Glass cosmetic serum bottle with precision reflection creation, fingerprint removal, dropper detail enhancement, and clean isolation.',
    alt: 'Cosmetic serum bottle with professional reflection and retouching'
  },
  // Timestamped images
  '1687185290899.jpeg': {
    filename: '1687185290899.jpeg',
    title: 'Designer Sunglasses',
    category: 'Accessories',
    description: 'Designer sunglasses with lens reflection balancing, metal frame polishing, precise clipping path isolation, and studio-quality retouching.',
    alt: 'Designer sunglasses professional photo retouching and clipping path'
  },
  '1690386320753.jpeg': {
    filename: '1690386320753.jpeg',
    title: 'Luxury Leather Handbag',
    category: 'Bags',
    description: 'Luxury leather handbag with multi-path clipping path, preserved leather grain texture, hardware polishing, and natural directional shadow.',
    alt: 'Luxury leather handbag with precision clipping path and retouching'
  },
  '1691595299886.jpeg': {
    filename: '1691595299886.jpeg',
    title: 'E-commerce Product Video',
    category: 'Video',
    description: 'E-commerce product video editing with clean cuts, color grading, and optimization for Amazon, TikTok, and social platforms.',
    alt: 'E-commerce product video editing and optimization'
  },
  '1693144321140.jpeg': {
    filename: '1693144321140.jpeg',
    title: 'Urban Designer Sneaker',
    category: 'Footwear',
    description: 'Premium designer sneaker retouched with sole detailing, logo crispness, scuff removal, and pure white background isolation for Amazon FBA.',
    alt: 'Urban designer sneaker photo retouching and pure white isolation'
  },
  '1698937341506.jpeg': {
    filename: '1698937341506.jpeg',
    title: 'Organic Serum Bottle',
    category: 'Cosmetics',
    description: 'Glass serum bottle with immaculate transparency, dropper precision, fingerprint elimination, and natural mirror reflection creation.',
    alt: 'Organic serum bottle glass retouching with reflection creation'
  },
  '1743090273681.jpeg': {
    filename: '1743090273681.jpeg',
    title: 'Fashion Apparel Collection',
    category: 'Apparel',
    description: 'Fashion apparel collection with precise color correction, tone consistency, fabric texture preservation, and professional studio grading.',
    alt: 'Fashion apparel collection color correction and retouching'
  },
  '1752247694469.jpeg': {
    filename: '1752247694469.jpeg',
    title: 'Product Photography Setup',
    category: 'General',
    description: 'Professional product photography prepared for e-commerce post-production including clipping paths and retouching.',
    alt: 'Professional product photography for e-commerce editing'
  },
  '1785505072566.jpeg': {
    filename: '1785505072566.jpeg',
    title: 'Complex Product Clipping',
    category: 'Clipping Path',
    description: 'Complex multi-part product isolated with precision hand-drawn clipping paths, preserving fine details and clean edges.',
    alt: 'Complex product clipping path and precision isolation'
  },
  '1787750124564.jpeg': {
    filename: '1787750124564.jpeg',
    title: 'Apparel Neck Joint Service',
    category: 'Apparel',
    description: 'Apparel garment edited with specialized neck joint technique, collar reconstruction, inner lining matching, and seamless assembly.',
    alt: 'Apparel neck joint and collar reconstruction service'
  },
  '1788684056774.jpeg': {
    filename: '1788684056774.jpeg',
    title: 'Fine Detail Image Masking',
    category: 'Masking',
    description: 'Intricate product requiring advanced alpha channel masking for delicate edges, preserving fine details with clean isolation.',
    alt: 'Advanced image masking for intricate product details'
  },
  '1789652964412.jpeg': {
    filename: '1789652964412.jpeg',
    title: 'Raster to Vector Conversion',
    category: 'Vector',
    description: 'Pixel-based artwork converted to clean, scalable vector format with precise manual tracing for logos and illustrations.',
    alt: 'Raster to vector conversion and manual logo tracing'
  }
};

export const getImageInfo = (imagePath) => {
  if (!imagePath) return IMAGE_MAP['hero.jpg'];
  const filename = imagePath.split('/').pop();
  return IMAGE_MAP[filename] || {
    filename,
    title: 'Product Image',
    category: 'Product',
    description: 'Professional e-commerce product image edited by Pro Retouching specialists with precision and care.',
    alt: 'Professional product photo editing'
  };
};

export default IMAGE_MAP;

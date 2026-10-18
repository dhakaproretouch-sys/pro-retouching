export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  startingPrice: string;
  turnaround: string;
  bullets: string[];
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const COMPANY_INFO = {
  name: "Pro Retouching",
  tagline: "Effortless Image Editing for E-commerce",
  subheading: "The Matchless Image/Video Post-production Service for E-commerce Sellers",
  phone: "+880 1712-345678",
  whatsapp: "+8801712345678",
  email: "support@proretouching.com",
  salesEmail: "sales@proretouching.com",
  skype: "live:proretouching_bd",
  website: "https://proretouching.com",
  address: "House 42, Road 11, Sector 4, Uttara, Dhaka-1230, Bangladesh",
  workingHours: "24 Hours / 5 Days (Monday – Friday), Weekend On-Demand Shifts",
  turnaroundDefault: "12 to 24 Hours standard, 4-hour rush service available",
  capacityDaily: "2,000+ images per day",
  experienceYears: "10+ Years in E-commerce Post-Production",
};

export const MARKETPLACE_LOGOS = [
  { name: "Amazon", label: "Amazon FBA" },
  { name: "eBay", label: "eBay Verified" },
  { name: "Shopify", label: "Shopify Stores" },
  { name: "Etsy", label: "Etsy Crafters" },
  { name: "Walmart", label: "Walmart Marketplace" },
  { name: "Fiverr", label: "Pro Top Rated" },
];

export const SNEAK_PEEK_COUNTERS = [
  { value: 50, suffix: "+", label: "Expert Designers", description: "In-house Photoshop specialists" },
  { value: 100000, suffix: "+", label: "Images Processed", description: "Pixel-perfect delivered outputs" },
  { value: 500, suffix: "+", label: "Projects Finished", description: "Global brand campaigns" },
  { value: 100, suffix: "+", label: "Happy Clients", description: "Long-term studio retainers" },
  { value: 10, suffix: "+", label: "Years Experience", description: "Dedicated commercial studio" },
  { value: 10000, suffix: "+", label: "Hours of Work", description: "Meticulous hand-drawn paths" },
];

export const PRICE_STATS_STRIP = [
  {
    iconName: "Tag",
    title: "Starts from $0.25",
    subtitle: "Per image clipping path with multi-tier pricing",
  },
  {
    iconName: "Percent",
    title: "Up to 30% Discount",
    subtitle: "Volume savings on bulk e-commerce catalog batches",
  },
  {
    iconName: "Zap",
    title: "2,000 Images / Day",
    subtitle: "High-capacity multi-shift production facility",
  },
  {
    iconName: "Clock",
    title: "Dedicated 24/5 Team",
    subtitle: "Round-the-clock support via Email, Mobile & WhatsApp",
  },
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: "20–50% Cost Saving",
    desc: "Competitive offshore pricing from Bangladesh compared to in-house studio overheads.",
  },
  {
    title: "Faster Turnaround",
    desc: "Guaranteed 12–24 hour delivery with an optional 4-hour expedited rush protocol.",
  },
  {
    title: "3 Working Shifts a Day",
    desc: "Continuous round-the-clock workflow keeping projects active across all time zones.",
  },
  {
    title: "24/5 Production & Support",
    desc: "Live dedicated project managers available via Skype, WhatsApp, and phone.",
  },
  {
    title: "3-Step Quality Control",
    desc: "Every image passes designer review, QC lead inspection, and final director sign-off.",
  },
  {
    title: "Monthly Payment System",
    desc: "Flexible net-30 terms and consolidated monthly billing for verified enterprise accounts.",
  },
  {
    title: "High-Speed Internet",
    desc: "Dual gigabit fiber optic uplinks ensuring lightning-fast bulk image uploads & downloads.",
  },
  {
    title: "Latest Software Versions",
    desc: "Adobe Creative Cloud 2026, Capture One Pro, and calibrated Wacom Cintiq displays.",
  },
  {
    title: "Strict Deadlines Adherence",
    desc: "99.8% on-time delivery record backed by our service level agreement (SLA).",
  },
  {
    title: "Dedicated Team for Big Projects",
    desc: "Reserved pod of designers trained specifically on your brand style guidelines.",
  },
  {
    title: "NDA for File Privacy",
    desc: "Legally binding non-disclosure agreements, encrypted servers, and zero unauthorized usage.",
  },
  {
    title: "Free Revisions & Reworks",
    desc: "Unlimited complimentary retouching adjustments until you are 100% satisfied.",
  },
];

// Product image assets generated in studio
export const ASSET_HERO = "/src/assets/images/ecommerce_hero_products_1792334147319.jpg";
export const ASSET_STUDIO = "/src/assets/images/photo_retouching_studio_1792334148075.jpg";
export const ASSET_SWEATER = "/src/assets/images/ghost_mannequin_sweater_1792334148340.jpg";
export const ASSET_SNEAKER = "/src/assets/images/footwear_sneaker_retouch_1792334148843.jpg";
export const ASSET_BOTTLE = "/src/assets/images/cosmetic_bottle_reflection_1792334149349.jpg";

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "image-post-production",
    slug: "image-post-production",
    title: "Image Post Production",
    shortDesc: "Complete commercial photo refinement, RAW processing, catalog uniformity, and e-commerce ready deliverables.",
    fullDesc: "Our comprehensive image post-production service covers end-to-end photo processing for top-tier retailers. From camera RAW conversion and chromatic aberration removal to exposure balancing, skin smoothing, dust cleaning, and multi-format web optimization, we ensure every product looks pristine across marketplace feeds.",
    category: "Core Editing",
    startingPrice: "$0.50",
    turnaround: "12-24 Hours",
    bullets: [
      "RAW development and color temperature balancing",
      "Imperfection removal, scratch and lint cleanup",
      "Marketplace compliant white and pure-gray background standards",
      "Consistent product alignment, margin ratios, and web compression",
    ],
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
    beforeLabel: "RAW Capture",
    afterLabel: "Post-Produced",
  },
  {
    id: "ghost-mannequin",
    slug: "ghost-mannequin",
    title: "Ghost Mannequin / Neck Joint",
    shortDesc: "Invisible hollow-man 3D effect seamlessly combining front, neck, inner lining, and sleeve openings.",
    fullDesc: "Ghost mannequin editing gives apparel a lifelike three-dimensional hollow look without showing a distracting live model or plastic mannequin. We expertly merge front shots, interior back collar labels, and hem linings to create flawless, symmetrical e-commerce garment presentations that boost buyer confidence.",
    category: "Apparel Specialist",
    startingPrice: "$0.80",
    turnaround: "12-24 Hours",
    bullets: [
      "Neck joint insertion with label and collar stitching preservation",
      "Sleeve, cuff, and bottom hem 3D depth alignment",
      "Symmetry correction, wrinkle smoothing, and shape warping",
      "Natural internal drop shadow for realistic fabric depth",
    ],
    beforeImage: ASSET_SWEATER,
    afterImage: ASSET_SWEATER,
    beforeLabel: "On Mannequin",
    afterLabel: "3D Hollow Ghost",
  },
  {
    id: "background-removal",
    slug: "background-removal",
    title: "Background Removal",
    shortDesc: "Precision manual Pen Tool clipping paths to isolate products on pure white, transparent, or custom scenes.",
    fullDesc: "Never settle for rough automated AI cutout artifacts. Our senior Photoshop artisans hand-draw 100% manual Pen Tool bezier paths around every curve, edge, and hole. We guarantee feather-smooth, razor-sharp outlines ready for Amazon, eBay, Shopify, and Google Shopping specifications.",
    category: "Clipping & Isolation",
    startingPrice: "$0.25",
    turnaround: "6-12 Hours",
    bullets: [
      "100% hand-drawn vector Pen Tool clipping paths",
      "Clean isolation around complex hardware and transparent materials",
      "Amazon FBA approved pure white background (RGB 255, 255, 255)",
      "High-resolution PNG transparent cutouts with alpha channels",
    ],
    beforeImage: ASSET_SNEAKER,
    afterImage: ASSET_SNEAKER,
    beforeLabel: "Original Studio Shot",
    afterLabel: "Pure White Cutout",
  },
  {
    id: "photo-retouching",
    slug: "photo-retouching",
    title: "Photo Retouching",
    shortDesc: "High-end product and beauty retouching, surface polish, scratch removal, and texture preservation.",
    fullDesc: "Whether you sell luxury jewelry, leather goods, footwear, or cosmetics, minor studio scratches and fingerprints destroy conversion rates. Our photo retouching service cleans blemishes, smooths metal surfaces, restores fabric weaves, and sharpens critical product details without looking artificial or over-processed.",
    category: "Retouching",
    startingPrice: "$0.75",
    turnaround: "12-24 Hours",
    bullets: [
      "Dust, lint, scratch, and fingerprint elimination",
      "Leather texture enhancement and wrinkle reduction",
      "Diamond and gemstone brilliance enhancement",
      "Frequency separation for natural skin smoothing",
    ],
    beforeImage: ASSET_BOTTLE,
    afterImage: ASSET_BOTTLE,
    beforeLabel: "Unretouched",
    afterLabel: "Commercial Retouch",
  },
  {
    id: "color-correction",
    slug: "color-correction",
    title: "Color Correction & Recoloring",
    shortDesc: "Accurate color matching, pantone alignment, and digital variant recoloring from a single master shot.",
    fullDesc: "Product returns due to inaccurate colors cost e-commerce merchants millions every year. Pro Retouching colorists calibrate your product imagery against physical Pantone swatches and fabric color cards. We also generate dozens of colorway variants digitally from a single master photo, saving immense photo shoot budgets.",
    category: "Color & Grading",
    startingPrice: "$0.60",
    turnaround: "12-24 Hours",
    bullets: [
      "True-to-life Pantone and Hex swatch color matching",
      "Multi-color variant generation from a single base photograph",
      "Exposure and white balance calibration across bulk catalogs",
      "Pattern overlay and fabric tone consistency",
    ],
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
    beforeLabel: "Base Color",
    afterLabel: "Calibrated Variant",
  },
  {
    id: "shadow-reflection",
    slug: "shadow-reflection",
    title: "Shadow & Reflection Creation",
    shortDesc: "Natural drop shadows, original shadow preservation, floating shadows, and glossy mirror reflections.",
    fullDesc: "Floating products look detached and amateur. Our team crafts realistic dimensional drop shadows, directional sun casts, and mirror reflections that anchor items naturally to the floor. We can preserve existing studio ground shadows or build custom soft-diffused shadows from scratch.",
    category: "Enhancement",
    startingPrice: "$0.40",
    turnaround: "12-24 Hours",
    bullets: [
      "Natural drop shadow and contact shadow creation",
      "Original studio lighting shadow preservation",
      "High-end mirror and glass surface reflections",
      "Adjustable opacity, blur radius, and light angles",
    ],
    beforeImage: ASSET_BOTTLE,
    afterImage: ASSET_BOTTLE,
    beforeLabel: "Flat No-Shadow",
    afterLabel: "Ground Reflection",
  },
  {
    id: "clipping-path",
    slug: "clipping-path",
    title: "Image Cut-out / Clipping Path",
    shortDesc: "Handmade vector clipping paths for simple, medium, complex, and super-complex items.",
    fullDesc: "From simple geometric packaging to intricate bicycles, chain necklaces, and wire mesh furniture, we provide multi-path clipping paths that allow art directors to isolate individual parts and materials with zero loss of vector sharpness.",
    category: "Clipping & Isolation",
    startingPrice: "$0.25",
    turnaround: "6-12 Hours",
    bullets: [
      "Simple to super-complex multi-path layering",
      "Zero automated algorithms — 100% human-crafted accuracy",
      "Embedded Photoshop clipping paths (EPS/TIFF/PSD)",
      "Accurate edge compensation preventing fringing",
    ],
    beforeImage: ASSET_SNEAKER,
    afterImage: ASSET_SNEAKER,
    beforeLabel: "Rough Background",
    afterLabel: "Isolated Vector Path",
  },
  {
    id: "neck-joint",
    slug: "neck-joint",
    title: "Neck Joint Service",
    shortDesc: "Dedicated collar and neckline replacement for apparel brands and fashion catalog workflows.",
    fullDesc: "A specialized sub-service of ghost mannequin where our editors attach inner collar tags, size prints, and interior neck fabrics with realistic textile folds and lighting.",
    category: "Apparel Specialist",
    startingPrice: "$0.70",
    turnaround: "12-24 Hours",
    bullets: [
      "Collar tag alignment and perspective correction",
      "Lining tone and pattern matching",
      "Removal of model hair and neck interference",
      "Crisp edge transitions on delicate knitwear",
    ],
    beforeImage: ASSET_SWEATER,
    afterImage: ASSET_SWEATER,
    beforeLabel: "Mannequin Showing",
    afterLabel: "Seamless Inner Neck",
  },
  {
    id: "image-masking",
    slug: "image-masking",
    title: "Image Masking",
    shortDesc: "Alpha channel, hair masking, fur, and transparent fabric isolation where Pen Tool cannot reach.",
    fullDesc: "Fine flyaway model hair, animal fur coats, chiffon gowns, and semi-transparent smoke or glass require advanced channel masking and refinement techniques. We extract every strand without leaving halos or muddy outlines.",
    category: "Clipping & Isolation",
    startingPrice: "$0.90",
    turnaround: "12-24 Hours",
    bullets: [
      "Advanced hair and fur strand isolation",
      "Alpha channel and color range masking",
      "Preservation of semi-transparent organza, tulle, and veil fabrics",
      "Edge defringing and background color contamination removal",
    ],
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
    beforeLabel: "Complex Hair/Edges",
    afterLabel: "Fine Strand Mask",
  },
  {
    id: "raster-to-vector",
    slug: "raster-to-vector",
    title: "Raster to Vector Conversion",
    shortDesc: "Redrawing low-resolution logos, product schematics, and artwork into infinitely scalable SVG/AI vector files.",
    fullDesc: "Turn pixelated JPEG and PNG logos, badges, technical drawings, and sketches into clean, infinitely scalable vector artwork. Every line, gradient, and anchor point is plotted manually by vector illustration artists.",
    category: "Graphics & Vector",
    startingPrice: "$2.50",
    turnaround: "12-24 Hours",
    bullets: [
      "Manual vector tracing in Adobe Illustrator",
      "Scalable EPS, SVG, PDF, and AI delivery files",
      "Font matching or custom vector letter recreation",
      "Color separation for screen printing and embroidery",
    ],
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
    beforeLabel: "Pixelated Raster",
    afterLabel: "Crisp Vector Paths",
  },
  {
    id: "graphic-design",
    slug: "graphic-design",
    title: "Graphic Design",
    shortDesc: "Amazon A+ content, lifestyle banners, product infographics, and e-commerce marketing collaterals.",
    fullDesc: "Elevate your conversion rate with persuasive visual marketing assets: Amazon EBC / A+ modules, benefit callout infographics, dimension overlays, and social media advertising creatives.",
    category: "Marketing Design",
    startingPrice: "$5.00",
    turnaround: "24-48 Hours",
    bullets: [
      "Amazon A+ Content and Brand Story modules",
      "Feature callout infographics and dimension diagrams",
      "Hero banners for Shopify and promotional landing pages",
      "Consistent typography, icons, and brand palette",
    ],
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
    beforeLabel: "Plain Product",
    afterLabel: "Sales Infographic",
  },
  {
    id: "video-editing",
    slug: "video-editing",
    title: "E-commerce Video Editing",
    shortDesc: "Polished 360-spin video trimming, color grading, pacing, and engaging shorts for TikTok, Reels & Amazon.",
    fullDesc: "Modern shoppers buy motion. We edit product unboxing videos, 360 turntable spins, social video ads, and Amazon video hero headers with clean cuts, captions, smooth transitions, and background audio.",
    category: "Video & Motion",
    startingPrice: "$10.00",
    turnaround: "24-48 Hours",
    bullets: [
      "360-degree turntable video stabilization and speed ramping",
      "Social-first aspect ratios (9:16, 1:1, 16:9)",
      "Subtitle synchronization and feature callout text",
      "Color grading matching product catalog photos",
    ],
    beforeImage: ASSET_HERO,
    afterImage: ASSET_HERO,
    beforeLabel: "Raw Footage",
    afterLabel: "Polished Video",
  },
  {
    id: "3d-product-modeling",
    slug: "3d-product-modeling",
    title: "3D Product Modeling & Rendering",
    shortDesc: "Photorealistic 3D CAD modeling, texturing, and angle rendering before physical production starts.",
    fullDesc: "Create realistic 3D product renders from photos or CAD drawings. Render limitless photorealistic angles, exploded views, and packaging renders without shipping physical prototypes to a photo studio.",
    category: "3D & Spatial",
    startingPrice: "$15.00",
    turnaround: "48-72 Hours",
    bullets: [
      "High-poly 3D modeling and UV mapping",
      "PBR material texturing (glass, metals, fabrics, plastics)",
      "Studio virtual lighting setups and 4K renders",
      "Interactive 3D GLTF / USDZ formats for web AR",
    ],
    beforeImage: ASSET_BOTTLE,
    afterImage: ASSET_BOTTLE,
    beforeLabel: "Wireframe / CAD",
    afterLabel: "4K Render",
  },
  {
    id: "web-development",
    slug: "web-development",
    title: "E-commerce Web Development",
    shortDesc: "Custom Shopify, WooCommerce, and headless e-commerce frontend development for modern brands.",
    fullDesc: "Complementing our visual services, our web engineers build high-performance e-commerce storefronts on Shopify, WooCommerce, and modern React stacks optimized for lightning-fast conversions.",
    category: "Development",
    startingPrice: "$150.00",
    turnaround: "5-10 Days",
    bullets: [
      "Custom Shopify theme design and customization",
      "Speed optimization achieving 90+ Google PageSpeed scores",
      "Mobile-first responsive architecture",
      "Conversion rate optimization (CRO) checkout flows",
    ],
    beforeImage: ASSET_STUDIO,
    afterImage: ASSET_STUDIO,
    beforeLabel: "Wireframe",
    afterLabel: "Live Storefront",
  },
];

export const PRICING_PLANS = [
  {
    id: "basic-clipping",
    title: "Basic Clipping Path",
    price: "$0.25",
    unit: "per image",
    popular: false,
    description: "Best for simple shaped products like books, balls, boxes, and basic bottles.",
    features: [
      "100% Hand-Drawn Pen Tool Paths",
      "Pure White or Transparent PNG",
      "12-24 Hours Turnaround",
      "Simple Geometric Shapes",
      "Free Revisions Included",
      "Web Optimized File Formats",
    ],
    bestFor: "Books, smartphones, simple boxes, single bottles",
  },
  {
    id: "photo-retouching",
    title: "Photo Retouching",
    price: "$0.75",
    unit: "per image",
    popular: true,
    description: "High-end commercial cleanup for apparel, footwear, cosmetics, and jewelry.",
    features: [
      "Dust, Scratch & Blemish Removal",
      "Skin & Fabric Smoothing",
      "Natural Drop Shadow or Reflection",
      "Color Calibration & Matching",
      "Clipping Path Included",
      "Priority 12-Hour Turnaround",
      "Unlimited Free Revisions",
    ],
    bestFor: "Sneakers, cosmetics, bags, fashion apparel",
  },
  {
    id: "ghost-mannequin",
    title: "Ghost Mannequin / 3D",
    price: "$0.80",
    unit: "per image",
    popular: false,
    description: "Invisible 3D hollow mannequin effect for fashion brands & apparel catalogs.",
    features: [
      "Front & Back Collar Joint Merging",
      "Sleeve & Hem Depth Alignment",
      "Wrinkle Smoothing & Shape Correction",
      "Internal Fabric Shadow Creation",
      "Pure White Background Included",
      "Brand Label Preservation",
      "24-Hour Delivery Guarantee",
    ],
    bestFor: "Sweaters, jackets, t-shirts, dresses, activewear",
  },
];

export const BULK_DISCOUNT_TIERS = [
  { tier: "1 – 99 Images", discount: "Standard Price", note: "Pay-as-you-go per project" },
  { tier: "100 – 499 Images", discount: "10% Discount", note: "Ideal for seasonal catalog drops" },
  { tier: "500 – 1,999 Images", discount: "20% Discount", note: "Dedicated team & project lead" },
  { tier: "2,000+ Images", discount: "Up to 30% Discount", note: "Custom enterprise contract & SLA" },
];

export const FAQ_ITEMS = [
  {
    question: "How do I send my test images for the Free Trial?",
    answer: "You can submit 2 to 3 sample photos directly through our 'Free Test' page using our drag-and-drop uploader. Alternatively, you can share a Dropbox, Google Drive, WeTransfer, or OneDrive link. We will retouch them and send them back within 12 hours with zero commitment.",
  },
  {
    question: "What is your typical turnaround time?",
    answer: "Our standard delivery time is 12 to 24 hours for batches up to 500 images. For urgent deadlines, we offer an expedited 4-hour or 8-hour rush turnaround. Because our studio operates 3 shifts per day (24/5), work continues while your local team sleeps.",
  },
  {
    question: "Do you use automated AI tools or real human editors?",
    answer: "All clipping paths, ghost mannequin joints, and high-end retouching are 100% hand-crafted by professional graphic designers using Adobe Photoshop and Wacom tablets. Automated AI tools often chew edges, blur textures, and miss intricate details; our human precision ensures marketplace-ready results every time.",
  },
  {
    question: "How are my files and intellectual property protected?",
    answer: "We sign strict Non-Disclosure Agreements (NDAs) with all clients. Your files are stored on secure encrypted storage and are never published, shared with third parties, or used in our public portfolio without your explicit written authorization.",
  },
  {
    question: "What payment methods and invoicing terms do you accept?",
    answer: "We accept PayPal, Stripe, major Credit Cards, Payoneer, and Direct Bank Wire Transfers (USD, EUR, GBP). For ongoing clients with regular image volume, we offer flexible weekly or monthly post-paid invoices.",
  },
  {
    question: "What happens if I need revisions on edited images?",
    answer: "We provide 100% free unlimited revisions until you are completely satisfied with the results. Simply reply to our delivery email or ping us on WhatsApp/Skype with your feedback.",
  },
];

export const PORTFOLIO_WORKS = [
  {
    id: "work-1",
    title: "Luxury Leather Handbag",
    category: "Clipping Path",
    service: "Background Removal & Shadow",
    description: "Multi-path cutout with preserved leather grain and soft directional contact shadow.",
    image: ASSET_HERO,
    turnaround: "12 Hours",
    clientType: "Fashion Retailer",
  },
  {
    id: "work-2",
    title: "Cable Knit Crewneck Sweater",
    category: "Ghost Mannequin",
    service: "Ghost Mannequin & Neck Joint",
    description: "Seamless hollow-man neck joint assembly with collar tag alignment and shape balance.",
    image: ASSET_SWEATER,
    turnaround: "12 Hours",
    clientType: "Apparel Brand",
  },
  {
    id: "work-3",
    title: "Urban Designer Sneaker",
    category: "Retouching",
    service: "Photo Retouching & Shadow",
    description: "Sole cleaning, stitching crispness enhancement, and pure white Amazon FBA isolation.",
    image: ASSET_SNEAKER,
    turnaround: "8 Hours",
    clientType: "Footwear Merchant",
  },
  {
    id: "work-4",
    title: "Organic Serum Bottle",
    category: "Shadow",
    service: "Reflection & Glass Retouching",
    description: "Immaculate dropper transparency, fingerprint removal, and natural mirror reflection.",
    image: ASSET_BOTTLE,
    turnaround: "12 Hours",
    clientType: "Beauty Brand",
  },
  {
    id: "work-5",
    title: "Fashion Studio Retouching Suite",
    category: "Color Correction",
    service: "Studio Post-Production",
    description: "High-volume color grading and model apparel alignment across 45 SKUs.",
    image: ASSET_STUDIO,
    turnaround: "24 Hours",
    clientType: "E-commerce Agency",
  },
  {
    id: "work-6",
    title: "Designer Sunglasses & Accessories",
    category: "Clipping Path",
    service: "Lens Reflection Balancing",
    description: "Studio glare reduction, metal frame polishing, and subtle gradient backdrop.",
    image: ASSET_HERO,
    turnaround: "12 Hours",
    clientType: "Eyewear Boutique",
  },
];

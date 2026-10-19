/** Shared TypeScript types for the admin dashboard (backend envelope + models). */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminUser {
  id?: string;
  _id?: string;
  email: string;
  role: string;
}

export interface HeroSlide {
  _id: string;
  image: string;
  publicId?: string;
  alt: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  newQuotes: number;
  newFreeTests: number;
  unreadMessages: number;
  totalWorks: number;
  requestsPerDay: { date: string; count: number }[];
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/* ---------------- Content models ---------------- */

export interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  bullets: string[];
  image: string;
  beforeImage: string;
  afterImage: string;
  order: number;
  isActive: boolean;
}

export interface Work {
  _id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  order: number;
  isActive: boolean;
}

export interface PricingPlan {
  _id: string;
  name: string;
  price: string;
  unit: string;
  features: string[];
  isPopular: boolean;
  order: number;
}

export interface StatItem {
  _id: string;
  label: string;
  value: number;
  suffix: string;
  order: number;
}

export interface ClientLogo {
  _id: string;
  name: string;
  image: string;
  order: number;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  text: string;
  order: number;
}

export interface WhyChooseItem {
  title: string;
  desc: string;
}

export interface PriceHighlightItem {
  title: string;
  value: string;
  subtext: string;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  social: {
    facebook: string;
    linkedin: string;
    skype: string;
    whatsapp: string;
  };
  footerText: string;
  aboutText: string;
  whyChoose: WhyChooseItem[];
  priceHighlights: PriceHighlightItem[];
}

/* ---------------- Inbox models ---------------- */

export type QuoteStatus = 'new' | 'in_progress' | 'done';
export type FreeTestStatus = 'pending' | 'in_progress' | 'done';

export interface Quote {
  _id: string;
  service: string;
  quantity: string;
  email: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface FreeTestFile {
  url: string;
  publicId: string;
}

export interface FreeTest {
  _id: string;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  files: FreeTestFile[];
  status: FreeTestStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

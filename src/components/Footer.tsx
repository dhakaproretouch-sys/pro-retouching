import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageSquare, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { COMPANY_INFO } from '../data/constants';
import { useServices, useSettings } from '../hooks/usePublic';

export const Footer: React.FC = () => {
  const { services } = useServices();
  const { settings } = useSettings();
  const whatsappDigits = (settings.whatsapp || '').replace(/\D/g, '');
  const skypeHref = settings.skype ? `skype:${settings.skype}?chat` : '#';
  return (
    <footer className="bg-[#0F2A55] text-slate-300 pt-16 pb-10 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-blue-900/80">
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0F2A55] shadow-md">
                <svg
                  className="w-5 h-5 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <polyline points="21 15 16 10 5 21" />
                  <line x1="3" y1="19" x2="21" y2="19" stroke="#F59E0B" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight text-xl font-heading font-extrabold text-white">
                  <span>PRO</span>
                  <span className="text-amber-400 ml-1.5">RETOUCHING</span>
                </div>
                <span className="text-xs text-blue-200/70">Bangladesh Studio</span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.tagline}. High-volume, hand-crafted image and video post-production for global e-commerce sellers, Amazon merchants, and fashion houses.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% NDA Protected & Data Secure</span>
            </div>
          </div>

          {/* Column 2: Stay Connected */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Stay Connected</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{settings.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp: {settings.phone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Skype: {settings.skype}</span>
                </div>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href={settings.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-900/60 hover:bg-amber-500 hover:text-white flex items-center justify-center text-slate-300 transition-colors text-xs font-bold"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href={settings.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-900/60 hover:bg-amber-500 hover:text-white flex items-center justify-center text-slate-300 transition-colors text-xs font-bold"
                aria-label="LinkedIn"
              >
                IN
              </a>
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-900/60 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-slate-300 transition-colors text-xs font-bold"
                aria-label="WhatsApp"
              >
                WA
              </a>
              <a
                href={skypeHref}
                className="w-8 h-8 rounded-lg bg-blue-900/60 hover:bg-sky-500 hover:text-white flex items-center justify-center text-slate-300 transition-colors text-xs font-bold"
                aria-label="Skype"
              >
                SK
              </a>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>About Our Studio</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>All Post-Production Services</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Transparent Pricing & Bulk Rates</span>
                </Link>
              </li>
              <li>
                <Link to="/our-works" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Portfolio & Before / After</span>
                </Link>
              </li>
              <li>
                <Link to="/free-test" className="text-amber-400 font-semibold hover:underline flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request Free Test (2–3 Images)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Head Office */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Head Office</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <p className="leading-relaxed">{settings.address}</p>
              </div>
              <div className="pt-1 text-xs text-blue-200/80">
                <p className="font-semibold text-white">Operating Hours:</p>
                <p className="mt-0.5">{COMPANY_INFO.workingHours}</p>
                <p className="mt-1 text-emerald-300 font-medium">3 shifts daily · 24-hour turnaround guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            {settings.footerText || '© 2026 All Rights Reserved by Pro Retouching.'}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/free-test" className="hover:text-amber-400 transition-colors">SLA & Guarantee</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { COMPANY_INFO } from '../data/constants';
import { useSettings } from '../hooks/usePublic';

export const FloatingActions: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="pointer-events-auto p-3 rounded-full bg-white text-slate-800 shadow-lg border border-slate-200/80 hover:bg-slate-50 hover:text-amber-600 transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 animate-in fade-in zoom-in duration-200"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${(settings.whatsapp || COMPANY_INFO.whatsapp).replace(/\D/g, '')}?text=Hello%20Pro%20Retouching%2C%20I%20would%20like%20to%20inquire%20about%20your%20image%20editing%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Pro Retouching on WhatsApp"
        className="pointer-events-auto group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="text-sm font-semibold tracking-wide hidden sm:inline-block">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};

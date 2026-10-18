import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { COMPANY_INFO, SERVICES_LIST } from '../data/constants';
import { useToast } from '../components/Toast';

export const ContactUs: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'clipping-path',
    volume: '50-200',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast({ title: 'Please fill in the required fields', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast({
        title: 'Message Sent Successfully!',
        message: 'Thank you for reaching out. Our project lead will respond within 30 minutes via email/WhatsApp.',
        type: 'success',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'clipping-path',
        volume: '50-200',
        message: '',
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/70 via-rose-50/30 to-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
            Contact Pro Retouching
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have a project, bulk catalog drop, or custom editing requirement? Our team is available 24/5 to assist you.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Info Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form (Left 7 Cols) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
              <h2 className="text-2xl font-heading font-bold text-[#0F2A55]">
                Send Us a Message
              </h2>
              <p className="mt-1 text-sm text-slate-500 mb-8">
                Fill out the details below and we will prepare a dedicated proposal for your review.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Service Required
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    >
                      {SERVICES_LIST.map((srv) => (
                        <option key={srv.id} value={srv.slug}>
                          {srv.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Estimated Monthly Volume
                  </label>
                  <select
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  >
                    <option value="1-50">1 – 50 images</option>
                    <option value="50-200">50 – 200 images</option>
                    <option value="200-500">200 – 500 images</option>
                    <option value="500-1000">500 – 1,000 images</option>
                    <option value="1000+">1,000+ images (Bulk Catalog)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Project Requirements / Instructions *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your image specifications (background color, clipping paths, shadows, turnaround requirements, file format)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Protected by strict bilateral NDA</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Direct Contact Cards (Right 5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Head Office Card */}
              <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F2A55]">
                      Dhaka Production Studio
                    </h3>
                    <p className="text-xs text-slate-500">Head Office & Production Hub</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-13">
                  {COMPANY_INFO.address}
                </p>
                <div className="pl-13 pt-1 text-xs text-slate-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{COMPANY_INFO.workingHours}</span>
                </div>
              </div>

              {/* Direct Channels Card */}
              <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-[#0F2A55]">
                  Instant Contact Channels
                </h3>

                <div className="space-y-3 text-sm">
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors border border-transparent hover:border-emerald-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-900">WhatsApp (Instant Response)</p>
                      <p className="text-xs text-slate-500">{COMPANY_INFO.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 text-slate-700 hover:text-amber-700 transition-colors border border-transparent hover:border-amber-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Email Inquiries</p>
                      <p className="text-xs text-slate-500">{COMPANY_INFO.email}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 text-slate-700 transition-colors border border-transparent hover:border-sky-200">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Skype ID</p>
                      <p className="text-xs text-slate-500">{COMPANY_INFO.skype}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Graphic Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Studio Location
                  </h4>
                  <span className="text-[11px] text-amber-600 font-semibold">Uttara, Dhaka</span>
                </div>
                {/* Styled map container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-amber-500/10" />
                  <div className="relative text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-[#0F2A55] text-amber-400 mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>
                    <p className="text-xs font-bold text-[#0F2A55] mt-2">Uttara Commercial Zone</p>
                    <p className="text-[10px] text-slate-500">Dhaka-1230, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

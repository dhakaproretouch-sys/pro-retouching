import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  Award,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  Target,
  Eye,
  Check,
} from 'lucide-react';
import { COMPANY_INFO, ASSET_STUDIO, ASSET_HERO } from '../data/constants';
import { SafeImage } from '../components/SafeImage';

export const AboutUs: React.FC = () => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Upload & Project Brief',
      desc: 'Submit your RAW, TIFF, or JPEG files via our secure Web Portal, Dropbox, Google Drive, or FTP server with your specific style guideline.',
    },
    {
      step: '02',
      title: 'Hand-Crafted Editing',
      desc: 'Our specialized Photoshop craftsmen draw manual Pen Tool clipping paths, perform pixel-level retouching, or assemble 3D ghost mannequin joints.',
    },
    {
      step: '03',
      title: '3-Step Quality Control',
      desc: 'Every single image is rigorously audited by a Senior Quality Analyst and Production Director for edge precision and color fidelity before sign-off.',
    },
    {
      step: '04',
      title: 'Prompt Delivery & Revisions',
      desc: 'Download your web-ready deliverables within 12 to 24 hours. Request any adjustments with unlimited complimentary re-touching rounds.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-amber-50/70 via-rose-50/30 to-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
            The Team Behind The Pixels
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
            About Pro Retouching
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {COMPANY_INFO.tagline}. Based in Dhaka, Bangladesh, we are a premier commercial image post-production powerhouse dedicated to global e-commerce excellence.
          </p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">
                Our Heritage & Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
                Crafting Flawless Product Photography Since 2016
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Founded with a mission to bridge the gap between expensive Western production studios and slow, unreliable freelancing networks, Pro Retouching operates as an integrated offshore production extension for global retailers, photo studios, and creative agencies.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                We believe that great image post-production is an art of restraint: eliminating studio flaws, dust, reflections, and distracting wrinkles while preserving organic textile textures, natural leather grains, and authentic material luminescence.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Our Mission</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Deliver zero-defect catalog imagery at 50% lower overhead with absolute deadline reliability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F2A55] flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Our Vision</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      To be the world’s most trusted post-production studio for Amazon FBA and multi-channel retailers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[460px] bg-slate-100">
                <SafeImage
                  src={ASSET_STUDIO}
                  alt="Pro Retouching dedicated photo retouching studio in Dhaka"
                  fallbackLabel="Dedicated Dhaka Studio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Production Process */}
      <section className="py-20 bg-[#F8FAFC] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
              Our Disciplined Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
              How We Deliver Quality Every Time
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              A battle-tested 4-step pipeline ensuring consistent color fidelity, razor-sharp edges, and on-time turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all relative group"
              >
                <div className="text-3xl font-heading font-extrabold text-amber-500/30 group-hover:text-amber-500 transition-colors mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Facilities & Security */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2A55]">50+ In-House Specialists</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero freelancers or unqualified outsourcing. Every member of our team is an in-house salaried professional trained extensively on Adobe Creative Cloud and rigorous international catalog standards.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0F2A55] text-white flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2A55]">3 Shifts / 24-Hour Production</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our morning, evening, and night shifts run uninterrupted 5 days a week. We operate in real-time alignment with your US, UK, and European business hours for smooth communication.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2A55]">Enterprise Privacy & NDA</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unreleased fashion collections and secret product prototypes are safe with us. We sign bilateral NDAs, enforce strict on-premise USB/mobile restrictions, and maintain encrypted cloud backups.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-16 p-10 bg-gradient-to-r from-[#0F2A55] to-[#1A3E75] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Test our work with 2–3 free sample images
              </h3>
              <p className="text-slate-300 text-sm max-w-xl">
                Experience our manual clipping paths and retouching quality firsthand without spending a dime. Delivered in under 12 hours.
              </p>
            </div>
            <Link
              to="/free-test"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg whitespace-nowrap transition-transform hover:scale-105"
            >
              Get Free Test Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

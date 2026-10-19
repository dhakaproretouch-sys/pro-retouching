import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  Tag,
  Zap,
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { SkeletonText } from '../components/Skeleton';
import { useService } from '../hooks/usePublic';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { service, loading } = useService(slug);

  // Only redirect once we know the slug definitively does not exist (settled 404)
  if (!loading && !service) {
    return <Navigate to="/services" replace />;
  }

  // Skeleton: no fallback matched this slug (e.g. admin-created service, slow first paint)
  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-slate-50 border-b border-slate-200/80 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-amber-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Services</span>
            </Link>
          </div>
        </div>
        <section className="py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/3] rounded-3xl bg-slate-100 animate-pulse" />
              <SkeletonText lines={2} />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <SkeletonText lines={6} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb & Navigation */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-amber-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Services</span>
          </Link>
          <div className="text-slate-400 hidden sm:block">
            <span>Services</span> / <span className="text-slate-700 font-semibold">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Main Service Content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Interactive Before/After Slider */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xl">
                <BeforeAfterSlider
                  beforeImage={service.beforeImage}
                  afterImage={service.afterImage}
                  beforeLabel={service.beforeLabel || 'Original File'}
                  afterLabel={service.afterLabel || 'Pro Retouched'}
                  aspectRatio="aspect-[4/3]"
                  variant={
                    service.id === 'background-removal' || service.id === 'clipping-path'
                      ? 'cutout'
                      : 'standard'
                  }
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>100% hand-crafted by senior Photoshop artists</span>
                </div>
                <span className="font-bold text-[#0F2A55]">Amazon & Shopify Ready</span>
              </div>
            </div>

            {/* Right: Service Details & CTAs */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-3 py-1 rounded-md mb-3">
                  {service.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
                  {service.title}
                </h1>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  {service.fullDesc}
                </p>
              </div>

              {/* Price & Turnaround Specs */}
              <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Starting Rate
                  </span>
                  <div className="text-2xl font-heading font-extrabold text-[#0F2A55] mt-0.5">
                    {service.startingPrice}
                    <span className="text-xs text-slate-500 font-normal"> / image</span>
                  </div>
                  <span className="text-[11px] text-amber-600 font-medium">Up to 30% bulk discount</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Turnaround Time
                  </span>
                  <div className="text-xl font-heading font-extrabold text-[#0F2A55] mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{service.turnaround}</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">4h Rush available</span>
                </div>
              </div>

              {/* Key Deliverables */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                  What’s Included in This Service
                </h3>
                <div className="space-y-2.5">
                  {service.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <Link
                  to={`/free-test?service=${service.slug}`}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Test This Service For Free (2–3 Images)</span>
                </Link>

                <Link
                  to="/contact"
                  className="w-full py-3.5 bg-white text-[#0F2A55] hover:bg-slate-50 border border-slate-200/90 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>Request Custom Bulk Quote</span>
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero financial commitment · Free unlimited revisions included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Comparison Section */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F2A55]">
              Why Pro Retouching Hand-Drawn Quality Wins
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Automated AI apps fail around transparent materials, fine jewelry, soft fabric folds, and model hair.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-red-200 shadow-sm">
              <h3 className="text-base font-bold text-red-600 mb-3 flex items-center gap-2">
                <span>✕ Automated AI Tools</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li>• Blurry edge halos and pixelated borders on curved products</li>
                <li>• Distorted stitching lines and lost fabric texture micro-details</li>
                <li>• Unnatural jagged silhouettes that fail Amazon seller audits</li>
                <li>• Zero human contextual understanding for styling or symmetry</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-sm">
              <h3 className="text-base font-bold text-emerald-700 mb-3 flex items-center gap-2">
                <span>✓ Pro Retouching Artisans</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li>• 100% manual Pen Tool bezier paths with smooth sub-pixel curvature</li>
                <li>• High-frequency separation preserving authentic fabric and leather grain</li>
                <li>• Natural ground contact shadows and soft reflections that sell</li>
                <li>• 3-tier inspection with guaranteed pixel-perfection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

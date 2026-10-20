import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, Sparkles, X } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { SkeletonGrid } from '../components/Skeleton';
import { useWorks } from '../hooks/usePublic';

type WorkItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  beforeImage: string;
  afterImage: string;
  turnaround: string;
  clientType: string;
};

export const OurWorks: React.FC = () => {
  const [activeModalItem, setActiveModalItem] = useState<WorkItem | null>(null);
  const { works, loading } = useWorks();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/70 via-rose-50/30 to-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
            Selected Commercial Portfolio
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
            Our Works & Case Studies
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real before and after image post-production delivered for global footwear brands, luxury fashion labels, and high-volume Amazon sellers.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && works.length === 0 ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {works.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  {/* Image Container */}
                  <div className="p-3 bg-slate-50">
                    <SafeImage
                      src={item.afterImage}
                      alt={item.title}
                      fallbackLabel={item.title}
                      className="block w-full h-auto object-contain"
                    />
                  </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-600 font-semibold mb-2">
                      <span className="uppercase tracking-wider">{item.category}</span>
                      <span className="text-slate-400">{item.clientType}</span>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.turnaround}</span>
                    </div>

                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0F2A55] hover:text-amber-600 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}

          {/* Free Test Bottom Banner */}
          <div className="mt-16 bg-[#0F2A55] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-heading font-extrabold text-white">
                Want to see your own products retouched?
              </h3>
              <p className="text-slate-300 text-sm max-w-xl">
                Send us 2 or 3 of your unedited RAW or camera JPEG files. We will process them and return them within 12 hours free of charge.
              </p>
            </div>
            <Link
              to="/free-test"
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-lg whitespace-nowrap transition-transform hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Free Sample Test</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox / Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700/50 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {activeModalItem.category} Case Study
                </span>
                <h3 className="text-xl font-heading font-bold text-slate-900">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-100">
              <SafeImage
                src={activeModalItem.afterImage}
                alt={activeModalItem.title}
                fallbackLabel={activeModalItem.title}
                className="block w-full h-auto object-contain"
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <p>{activeModalItem.description}</p>
              <Link
                to="/free-test"
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2.5 bg-[#0F2A55] hover:bg-amber-600 text-white font-semibold rounded-xl whitespace-nowrap transition-colors"
              >
                Send Us Similar Photos
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

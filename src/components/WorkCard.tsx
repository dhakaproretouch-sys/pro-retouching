import React from 'react';
import { Clock } from 'lucide-react';
import { SafeImage } from './SafeImage';

export interface WorkCardItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  beforeImage?: string;
  afterImage: string;
  turnaround: string;
  clientType: string;
}

export const WorkCard: React.FC<{ item: WorkCardItem }> = ({ item }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
    {/* Image Container (static combined before/after picture) */}
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

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>{item.turnaround}</span>
      </div>
    </div>
  </div>
);

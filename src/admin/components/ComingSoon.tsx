import React from 'react';
import { Construction } from 'lucide-react';
import { Card } from './Card';

interface ComingSoonProps {
  title: string;
  phase?: string;
}

/** Placeholder for admin pages that ship in a later phase. */
export const ComingSoon: React.FC<ComingSoonProps> = ({ title, phase = 'next phase' }) => (
  <div>
    <h1 className="text-2xl font-heading font-extrabold text-[#0F2A55] tracking-tight mb-6">
      {title}
    </h1>
    <Card>
      <div className="flex flex-col items-center text-center py-16 px-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <Construction className="w-6 h-6 text-amber-500" />
        </div>
        <h2 className="text-lg font-heading font-bold text-slate-700">Coming in {phase}</h2>
        <p className="mt-1.5 text-sm text-slate-500 max-w-sm">
          The <span className="font-semibold text-slate-600">{title}</span> manager is planned
          for a future release. Stay tuned!
        </p>
      </div>
    </Card>
  </div>
);

export default ComingSoon;

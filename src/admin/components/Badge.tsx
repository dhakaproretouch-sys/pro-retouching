import React from 'react';

export type BadgeTone = 'green' | 'red' | 'amber' | 'slate' | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
};

/** Small status pill (Active / Inactive / New / …). */
export const Badge: React.FC<BadgeProps> = ({ children, tone = 'slate', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wide ${toneClasses[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;

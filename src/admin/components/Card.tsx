import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Renders without padding when children manage their own layout (e.g. tables). */
  flush?: boolean;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/** White surface card used across the admin dashboard. */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  flush = false,
  title,
  subtitle,
  actions,
}) => (
  <div
    className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${
      flush ? '' : 'p-5 sm:p-6'
    } ${className}`}
  >
    {(title || actions) && (
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {title && <h3 className="text-sm font-bold text-slate-700">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

export default Card;

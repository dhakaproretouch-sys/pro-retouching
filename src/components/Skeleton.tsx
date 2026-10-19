import React from 'react';

/**
 * Lightweight skeleton primitives used by public pages while content loads.
 * Each variant matches the aspect ratio / height of the real content it
 * replaces so there is no layout shift when data arrives.
 */

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} aria-hidden="true" />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 2,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        className={`h-3.5 ${i === lines - 1 ? 'w-3/4' : 'w-full'} rounded-md`}
      />
    ))}
  </div>
);

/** Card-shaped skeleton matching the public service / work / pricing cards. */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm ${className}`}
    aria-hidden="true"
  >
    <SkeletonBlock className="w-full aspect-[16/10] rounded-none" />
    <div className="p-6 space-y-3">
      <SkeletonBlock className="h-5 w-2/3 rounded-md" />
      <SkeletonText lines={3} />
      <SkeletonBlock className="h-4 w-1/3 rounded-md mt-4" />
    </div>
  </div>
);

/** Responsive grid of skeleton cards. */
export const SkeletonGrid: React.FC<{ count?: number; className?: string }> = ({
  count = 6,
  className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
}) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;

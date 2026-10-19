import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Loading placeholder block. Compose multiples for tables/cards. */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />
);

/** Row of skeleton bars shaped like a table row. */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="divide-y divide-slate-100">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex items-center gap-4 px-5 py-4">
        {Array.from({ length: cols }).map((__, colIndex) => (
          <Skeleton
            key={colIndex}
            className={colIndex === 0 ? 'h-10 w-16 shrink-0' : 'h-4 flex-1'}
          />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;

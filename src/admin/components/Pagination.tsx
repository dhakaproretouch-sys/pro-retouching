import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

/** Inbox pagination footer. */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  pages,
  total,
  onChange,
  disabled = false,
}) => (
  <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/60">
    <p className="text-xs text-slate-500">
      {total} request{total === 1 ? '' : 's'} · Page {page} of {Math.max(pages, 1)}
    </p>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Prev
      </button>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= pages}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export default Pagination;

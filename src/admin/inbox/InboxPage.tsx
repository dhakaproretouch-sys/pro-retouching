import React, { useEffect, useRef } from 'react';
import { Download, Search, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import type { InboxItemBase, InboxHook } from './useInbox';
import { statusLabel, statusTone } from './status';
import { downloadCsv, toCsvRows } from './exportCsv';
import { InboxDrawer } from './InboxDrawer';

export interface InboxColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  /** Column widths use flex-grow factors; default 1. */
  grow?: number;
}

interface InboxPageProps<T extends InboxItemBase> {
  hook: InboxHook<T>;
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  /** Column headers/values used for the CSV export. */
  exportFields: (item: T) => Record<string, unknown>;
  /** Filename for the CSV download. */
  exportName: string;
  columns: InboxColumn<T>[];
  /** Rows shown in the detail drawer. */
  detailRows: (item: T) => { label: string; value: React.ReactNode }[];
  /** Status filter options; omit to hide the status select. */
  statusOptions?: { value: string; label: string }[];
  statusFor?: (item: T) => string | undefined;
  /** Files shown in the drawer (free tests). */
  filesFor?: (item: T) => { url: string; publicId?: string }[] | undefined;
  /** Main identifier shown as the drawer title. */
  titleFor: (item: T) => string;
  subtitleFor?: (item: T) => string | undefined;
  searchPlaceholder?: string;
}

/** Shared list view for all three inbox pages. */
export function InboxPage<T extends InboxItemBase>({
  hook,
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
  exportFields,
  exportName,
  columns,
  detailRows,
  statusOptions,
  statusFor,
  filesFor,
  titleFor,
  subtitleFor,
  searchPlaceholder = 'Search by name, email or phone…',
}: InboxPageProps<T>) {
  const { items, pagination, isLoading, isError, selected } = hook;

  // Debounce search so we do not hit the API on every keystroke.
  const [searchDraft, setSearchDraft] = React.useState(hook.search);
  const setSearch = hook.setSearch;
  const currentSearch = hook.search;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (searchDraft !== currentSearch) setSearch(searchDraft);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchDraft, currentSearch, setSearch]);

  const handleExport = () => {
    downloadCsv(exportName, toCsvRows(items.map(exportFields)));
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            aria-label={`Search ${title}`}
          />
        </div>

        {statusOptions && (
          <select
            value={hook.status}
            onChange={(event) => hook.setStatus(event.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Filter by status"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <Card flush>
        {/* Headers */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="hidden md:flex items-center gap-4 px-5 py-3 bg-slate-50/70 border-b border-slate-200">
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex-1 min-w-0 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                style={{ flexGrow: column.grow || 1 }}
              >
                {column.header}
              </div>
            ))}
            <div className="w-10 shrink-0" />
          </div>
        )}

        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={icon}
            title={`Could not load ${title.toLowerCase()}`}
            description="Something went wrong while fetching data. Try refreshing the page."
            action={
              <Button variant="secondary" onClick={hook.refetch}>
                Retry
              </Button>
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={icon}
            title={emptyTitle}
            description={hook.search || hook.status !== 'all' ? 'No results match your filters.' : emptyDescription}
          />
        ) : (
          <div>
            {items.map((item) => {
              const status = statusFor ? statusFor(item) : undefined;
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => hook.setSelected(item)}
                  className="w-full text-left flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 bg-white border-b border-slate-100 last:border-b-0 hover:bg-amber-50/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="flex-1 min-w-0"
                      style={{ flexGrow: column.grow || 1 }}
                    >
                      {column.render(item)}
                    </div>
                  ))}
                  {status && (
                    <Badge tone={statusTone(status)}>{statusLabel(status)}</Badge>
                  )}
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label="Delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (window.confirm('Delete this submission?')) hook.remove(item._id);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onChange={hook.setPage}
            />
          </div>
        )}
      </Card>

      {/* Detail drawer */}
      <InboxDetailSlot<T> hook={hook} detailRows={detailRows} statusOptions={statusOptions} filesFor={filesFor} titleFor={titleFor} subtitleFor={subtitleFor} statusFor={statusFor} />
    </div>
  );
}

interface InboxDetailSlotProps<T extends InboxItemBase> {
  hook: InboxHook<T>;
  detailRows: (item: T) => { label: string; value: React.ReactNode }[];
  statusOptions?: { value: string; label: string }[];
  filesFor?: (item: T) => { url: string; publicId?: string }[] | undefined;
  titleFor: (item: T) => string;
  subtitleFor?: (item: T) => string | undefined;
  statusFor?: (item: T) => string | undefined;
}

function InboxDetailSlot<T extends InboxItemBase>({
  hook,
  detailRows,
  statusOptions,
  filesFor,
  titleFor,
  subtitleFor,
  statusFor,
}: InboxDetailSlotProps<T>) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const selected = hook.selected;

  return (
    <InboxDrawer
      open={Boolean(selected)}
      title={selected ? titleFor(selected) : ''}
      subtitle={selected && subtitleFor ? subtitleFor(selected) : undefined}
      status={selected && statusFor ? statusFor(selected) : undefined}
      onClose={() => hook.setSelected(null)}
      rows={selected ? detailRows(selected) : []}
      statusOptions={statusOptions}
      currentStatus={selected && statusFor ? statusFor(selected) : undefined}
      onStatusChange={(status) => {
        if (selected) hook.updateStatus(selected._id, status);
      }}
      statusBusy={hook.updatingStatus}
      files={selected && filesFor ? filesFor(selected) : undefined}
      onDelete={() => {
        if (selected) hook.remove(selected._id);
        setDeleteOpen(false);
      }}
      deleteOpen={deleteOpen}
      onCancelDelete={() => setDeleteOpen(false)}
      deleteBusy={hook.deleting}
    />
  );
}

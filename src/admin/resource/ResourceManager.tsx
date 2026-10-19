import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { DragEndEvent } from '@dnd-kit/core';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { SortableList } from '../components/SortableList';
import { Toggle } from '../components/Toggle';
import type { ResourceManagerHook } from './useResourceManager';

export interface ResourceColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  /** Extra classes for the cell (e.g. 'hidden lg:block' for wide tables). */
  className?: string;
  /** Hide the column header on mobile lists (always hidden). */
  headerClassName?: string;
}

interface ResourceManagerProps<T extends { _id: string }> {
  hook: ResourceManagerHook<T>;
  title: string;
  description?: string;
  singular: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  columns: ResourceColumn<T>[];
  /** Label used in the delete confirmation message. */
  rowLabel: (item: T) => string;
  /** Add/edit modal component (rendered only when open). */
  FormModal: React.ComponentType<{
    open: boolean;
    item: T | null;
    onClose: () => void;
    onSaved: () => void;
  }>;
  /** Extra toolbar controls (e.g. category filter select). */
  toolbar?: React.ReactNode;
  canReorder?: boolean;
  hasToggle?: boolean;
  searchPlaceholder?: string;
  footerNote?: React.ReactNode;
}

/**
 * Generic content-manager view: header, search + toolbar, sortable rows with
 * toggle/edit/delete, loading skeletons, empty & error states, delete confirm
 * and the add/edit modal slot. Pair with useResourceManager.
 */
export function ResourceManager<T extends { _id: string }>({
  hook,
  title,
  description,
  singular,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  columns,
  rowLabel,
  FormModal,
  toolbar,
  canReorder = false,
  hasToggle = false,
  searchPlaceholder = 'Search…',
  footerNote,
}: ResourceManagerProps<T>) {
  const { visible, isLoading, isError, reorderBusy, toggling, deleting } = hook;
  const busy = reorderBusy || toggling || deleting;

  const labels: Record<string, string> = {};
  for (const item of visible) labels[item._id] = rowLabel(item);

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={hook.openAdd}>
            Add {singular}
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={hook.search}
            onChange={(event) => hook.setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            aria-label={`Search ${title}`}
          />
        </div>
        {toolbar}
      </div>

      <Card flush>
        {/* Column headers (desktop) */}
        {!isLoading && !isError && visible.length > 0 && (
          <div className="hidden md:flex items-center gap-4 px-5 py-3 bg-slate-50/70 border-b border-slate-200">
            {canReorder && <div className="w-8 shrink-0" />}
            {columns.map((column) => (
              <div
                key={column.key}
                className={`flex-1 min-w-0 text-[11px] font-bold uppercase tracking-wider text-slate-500 ${column.headerClassName || column.className || ''}`}
              >
                {column.header}
              </div>
            ))}
            {hasToggle && <div className="w-16 shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Active</div>}
            <div className="w-20 shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</div>
          </div>
        )}

        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-5 py-4">
                {canReorder && <Skeleton className="w-4 h-8" />}
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={Icon}
            title={`Could not load ${title.toLowerCase()}`}
            description="Something went wrong while fetching data. Try refreshing the page."
            action={
              <Button variant="secondary" onClick={() => hook.invalidate()}>
                Retry
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Icon}
            title={emptyTitle}
            description={hook.search ? 'No results match your search.' : emptyDescription}
            action={
              hook.search ? (
                <Button variant="secondary" onClick={() => hook.setSearch('')}>
                  Clear search
                </Button>
              ) : (
                <Button icon={<Plus className="w-4 h-4" />} onClick={hook.openAdd}>
                  Add {singular}
                </Button>
              )
            }
          />
        ) : canReorder ? (
          <SortableList
            ids={visible.map((item) => item._id)}
            labels={labels}
            busy={busy}
            onReorder={(activeId, overId) => {
              const event = { active: { id: activeId }, over: { id: overId } } as DragEndEvent;
              void hook.onDragEnd(event);
            }}
          >
            {visible.map((item) => (
              <ResourceRow<T>
                key={item._id}
                item={item}
                columns={columns}
                hasToggle={hasToggle}
                busy={busy}
                onEdit={() => hook.openEdit(item)}
                onDelete={() => hook.requestDelete(item)}
                onToggle={() => hook.toggle(item)}
              />
            ))}
          </SortableList>
        ) : (
          <div>
            {visible.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 bg-white border-b border-slate-100 last:border-b-0"
              >
                <ResourceRowCells<T> item={item} columns={columns} hasToggle={hasToggle} busy={busy} onEdit={() => hook.openEdit(item)} onDelete={() => hook.requestDelete(item)} onToggle={() => hook.toggle(item)} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && visible.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">
              {hook.total} item{hook.total === 1 ? '' : 's'}
              {hasToggle && ` · ${hook.activeCount} active`}
              {hook.search && ` · ${visible.length} matching "${hook.search}"`}
            </p>
            {footerNote && <div className="text-[11px] text-slate-400 hidden sm:block">{footerNote}</div>}
          </div>
        )}
      </Card>

      {/* Add modal */}
      <FormModal open={hook.addOpen} item={null} onClose={hook.closeForm} onSaved={hook.invalidate} />
      {/* Edit modal */}
      <FormModal
        open={Boolean(hook.editItem)}
        item={hook.editItem}
        onClose={hook.closeForm}
        onSaved={hook.invalidate}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(hook.deleteItem)}
        title={`Delete ${singular.toLowerCase()}?`}
        message={`"${hook.deleteItem ? rowLabel(hook.deleteItem) : ''}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={hook.confirmDelete}
        onCancel={hook.cancelDelete}
      />
    </div>
  );
}

interface ResourceRowCellsProps<T> {
  item: T;
  columns: ResourceColumn<T>[];
  hasToggle: boolean;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function ResourceRowCells<T extends { _id: string }>({
  item,
  columns,
  hasToggle,
  busy,
  onEdit,
  onDelete,
  onToggle,
}: ResourceRowCellsProps<T>) {
  const isActive = (item as { isActive?: boolean }).isActive !== false;

  return (
    <>
      {columns.map((column) => (
        <div key={column.key} className={`flex-1 min-w-0 ${column.className || ''}`}>
          {column.render(item)}
        </div>
      ))}

      {hasToggle && (
        <div className="w-16 shrink-0 flex justify-center">
          <Toggle checked={isActive} onChange={onToggle} disabled={busy} />
        </div>
      )}

      <div className="w-20 shrink-0 flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={onEdit}
          disabled={busy}
          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

interface ResourceRowProps<T> extends ResourceRowCellsProps<T> {}

function ResourceRow<T extends { _id: string }>(props: ResourceRowProps<T>) {
  return <ResourceRowCells<T> {...props} />;
}

/** Small helper for table cells showing an image thumbnail. */
export const Thumb: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className = 'w-14 h-10',
}) => (
  <div className={`${className} rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0`}>
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">None</div>
    )}
  </div>
);

/** Small helper for status/active badges in rows. */
export const ActiveBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <Badge tone={isActive ? 'green' : 'slate'}>{isActive ? 'Active' : 'Hidden'}</Badge>
);

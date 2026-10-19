import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { statusLabel, statusTone } from './status';

export interface InboxDetailRow {
  label: string;
  value: React.ReactNode;
}

interface InboxDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  status?: string;
  onClose: () => void;
  rows: InboxDetailRow[];
  /** Status selector rendered in the drawer footer (quotes / free-tests). */
  statusOptions?: { value: string; label: string }[];
  currentStatus?: string;
  onStatusChange?: (status: string) => void;
  statusBusy?: boolean;
  /** File attachments (free tests). */
  files?: { url: string; publicId?: string }[];
  onDelete?: () => void;
  deleteOpen?: boolean;
  onCancelDelete?: () => void;
  deleteBusy?: boolean;
}

const drawerRowClass = 'grid grid-cols-1 sm:grid-cols-3 gap-1 py-3 border-b border-slate-100 last:border-b-0';

export const InboxDrawer: React.FC<InboxDrawerProps> = ({
  open,
  title,
  subtitle,
  status,
  onClose,
  rows,
  statusOptions,
  currentStatus,
  onStatusChange,
  statusBusy = false,
  files,
  onDelete,
  deleteOpen = false,
  onCancelDelete,
  deleteBusy = false,
}) => {
  return (
    <>
      <Modal open={open} onClose={onClose} title={title} description={subtitle} size="lg">
        <div className="space-y-0">
          {status && (
            <div className="mb-4">
              <Badge tone={statusTone(status)}>{statusLabel(status)}</Badge>
            </div>
          )}

          {rows.map((row) => (
            <div key={row.label} className={drawerRowClass}>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-0.5">
                {row.label}
              </dt>
              <dd className="sm:col-span-2 text-sm text-slate-700 break-words">{row.value}</dd>
            </div>
          ))}

          {files && files.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Uploaded Files
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {files.map((file) => (
                  <a
                    key={file.url}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-amber-400 transition-colors"
                  >
                    <img
                      src={file.url}
                      alt="Uploaded file"
                      className="w-full h-28 object-cover"
                      loading="lazy"
                    />
                    <span className="flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold text-slate-500 group-hover:text-amber-600">
                      <Download className="w-3 h-3" />
                      Download
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {statusOptions && onStatusChange && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <label
              htmlFor="drawer-status"
              className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              Status
            </label>
            <select
              id="drawer-status"
              value={currentStatus || ''}
              onChange={(event) => onStatusChange(event.target.value)}
              disabled={statusBusy}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </Modal>

      {onDelete && (
        <ConfirmDialog
          open={deleteOpen}
          title="Delete entry?"
          message="This submission will be permanently removed."
          confirmLabel="Delete"
          loading={deleteBusy}
          onConfirm={onDelete}
          onCancel={onCancelDelete || (() => undefined)}
        />
      )}
    </>
  );
};

export default InboxDrawer;

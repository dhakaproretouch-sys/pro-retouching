export type QuoteStatus = 'new' | 'in_progress' | 'done';
export type FreeTestStatus = 'pending' | 'in_progress' | 'done';

export const QUOTE_STATUS_OPTIONS: { value: QuoteStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const FREE_TEST_STATUS_OPTIONS: { value: FreeTestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const STATUS_TONES: Record<string, 'green' | 'red' | 'amber' | 'blue' | 'slate'> = {
  new: 'amber',
  pending: 'amber',
  in_progress: 'blue',
  done: 'green',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  pending: 'Pending',
  in_progress: 'In Progress',
  done: 'Done',
};

export function statusTone(status: string): 'green' | 'red' | 'amber' | 'blue' | 'slate' {
  return STATUS_TONES[status] || 'slate';
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

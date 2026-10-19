/**
 * Build a CSV file from rows and trigger a client-side download.
 * Mirrors the server's /admin/export/:type CSV format without a round-trip.
 */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (rows.length === 0) return;

  const columns = Object.keys(rows[0]);
  const escape = (value: unknown): string => {
    const text = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const csv = [
    columns.map(escape).join(','),
    ...rows.map((row) => columns.map((column) => escape(row[column])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Flatten items into simple CSV rows (skips nested objects/arrays). */
export function toCsvRows<T extends Record<string, unknown>>(items: T[]): Record<string, unknown>[] {
  return items.map((item) => {
    const row: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      if (value === null || value === undefined) {
        row[key] = '';
      } else if (typeof value === 'object') {
        row[key] = Array.isArray(value)
          ? value.map((entry) => (typeof entry === 'object' ? JSON.stringify(entry) : String(entry))).join('; ')
          : JSON.stringify(value);
      } else {
        row[key] = value;
      }
    }
    return row;
  });
}

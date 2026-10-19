import React from 'react';

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

/** Simple responsive data table. Wrap in Card flush for the bordered look. */
export function Table<T>({ columns, rows, rowKey, emptyMessage = 'No data yet' }: TableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="px-5 py-12 text-center text-sm text-slate-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-slate-50/60 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className={`px-5 py-3.5 text-slate-700 ${column.className || ''}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

'use client';

import { useMemo, useState } from 'react';

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
}

interface DataTableProps<T extends { id: number | string }> {
  title: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  pageSize?: number;
}

export default function DataTable<T extends { id: number | string }>({
  title,
  columns,
  rows,
  pageSize = 10,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="bg-slate-100 ring-1 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full w-full">
      <h3 className="font-bold text-lg text-slate-900 mb-4">{title}</h3>

      <div className="overflow-x-auto grow">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-300">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="py-2 pr-4 font-bold text-slate-600 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-slate-400"
                >
                  No records yet.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-200 last:border-0 hover:bg-slate-50"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="py-2 pr-4 text-slate-700 whitespace-nowrap"
                    >
                      {String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-slate-600">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-2 py-1 rounded-lg disabled:opacity-40 hover:bg-slate-200 transition-colors"
        >
          previous
        </button>

        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`w-7 h-7 rounded-lg transition-colors ${
              n === page
                ? 'bg-sky-500 text-white'
                : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-2 py-1 rounded-lg disabled:opacity-40 hover:bg-slate-200 transition-colors"
        >
          next
        </button>
      </div>
    </div>
  );
}

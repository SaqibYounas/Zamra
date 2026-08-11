'use client';

import { ReactNode, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Pencil,
  Trash2,
} from 'lucide-react';

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
}

interface DataTableProps<T extends { id: number | string }> {
  title: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  pageSize?: number;
  icon?: ReactNode;
}

export default function DataTable<T extends { id: number | string }>({
  title,
  columns,
  rows,
  pageSize = 10,
  icon,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const rangeStart = rows.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, rows.length);

  const handleUpdate = async (row: T) => {
    console.log('Update:', row);

    // Dummy API Call
    try {
      await fetch(`/api/items/${row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(row),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (!confirmed) return;

    console.log('Delete:', id);

    // Dummy API Call
    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-100 ring-1 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl">
            {icon ?? <Layers className="w-5 h-5 text-sky-500" />}
          </div>

          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
        </div>

        <div className="flex items-center text-2xl font-bold text-sky-500">
          {rows.length.toLocaleString()}
        </div>
      </div>

      <div className="overflow-x-auto grow rounded-2xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="py-3 px-4 font-bold text-xs uppercase tracking-widest text-slate-500 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}

              <th className="py-3 px-4 font-bold text-xs uppercase tracking-widest text-slate-500 whitespace-nowrap text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-slate-400"
                >
                  No records yet.
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-t border-slate-200 hover:bg-sky-50/60 transition-colors ${
                    idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap"
                    >
                      {String(row[col.key])}
                    </td>
                  ))}

                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleUpdate(row)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      >
                        <Pencil size={14} />
                        Update
                      </button>

                      <button
                        onClick={() => handleDelete(row.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4 text-sm font-medium text-slate-500">
        <span className="text-xs">
          {rows.length === 0
            ? '0 results'
            : `Showing ${rangeStart}–${rangeEnd} of ${rows.length}`}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-7 h-7 rounded-lg font-bold transition-colors ${
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
            aria-label="Next page"
            className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

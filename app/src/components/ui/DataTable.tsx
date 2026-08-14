'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Pagination } from './Pagination';
import { SearchInput } from './SearchInput';
import { EmptyState, ErrorState } from './StatePlaceholders';
import { SkeletonTable } from './Skeleton';

export type DataTableColumn<T> = {
  /** Key into the row, also used as the React key for the cell. */
  key: keyof T & string;
  label: string;
  align?: 'left' | 'right' | 'center';
  /** Custom cell renderer. Falls back to the raw value as text. */
  render?: (row: T) => ReactNode;
  /** Tailwind width hint, e.g. `w-24`. */
  width?: string;
  /** Hide this column from the mobile card layout to reduce noise. */
  hideOnMobile?: boolean;
  /** Excluded from the search index (e.g. numeric ids). */
  notSearchable?: boolean;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  pageSize?: number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shown when there are no rows at all (as opposed to no search matches). */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  /** Rendered above the table, right-aligned next to the search box. */
  toolbar?: ReactNode;
  /** Row-level action buttons rendered in a trailing column. */
  rowActions?: (row: T) => ReactNode;
  className?: string;
};

/**
 * The app's table. One implementation handles search, pagination, loading,
 * error, empty and mobile layouts so no page has to rebuild that logic.
 *
 * Below `md` the table is replaced by a stacked card list: on a phone, a wide
 * grid either overflows or shrinks text to nothing, while label/value pairs
 * stay readable.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  pageSize = 10,
  loading = false,
  error = null,
  onRetry,
  searchable = false,
  searchPlaceholder = 'Search records…',
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  emptyAction,
  toolbar,
  rowActions,
  className = '',
}: DataTableProps<T>) {
  const [requestedPage, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;

    const searchKeys = columns.filter((column) => !column.notSearchable);

    return rows.filter((row) =>
      searchKeys.some((column) =>
        String(row[column.key] ?? '')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [rows, query, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Clamped on read rather than synced through an effect, so filtering or a
  // refetch that shrinks the result set can never leave us on a dead page.
  const page = Math.min(requestedPage, totalPages);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  const alignClass = (align: DataTableColumn<T>['align']) =>
    align === 'right'
      ? 'text-right'
      : align === 'center'
        ? 'text-center'
        : 'text-left';

  if (loading) {
    return (
      <div className={className}>
        <SkeletonTable rows={Math.min(pageSize, 6)} columns={columns.length} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorState description={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {searchable || toolbar ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <SearchInput
              value={query}
              onChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="sm:w-64"
            />
          ) : (
            <span />
          )}
          {toolbar ? (
            <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-card border border-line bg-surface-sunken/40">
          {query ? (
            <EmptyState
              title="No matches"
              description={`Nothing matched “${query}”. Try a different search term.`}
            />
          ) : (
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
            />
          )}
        </div>
      ) : (
        <>
          {/* Table layout — md and up */}
          <div className="scroll-x hidden max-h-[32rem] overflow-y-auto rounded-card border border-line md:block">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`${alignClass(column.align)} ${column.width ?? ''}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {rowActions ? (
                    <th scope="col" className="text-right" data-actions-col>
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={getRowId(row)}>
                    {columns.map((column) => (
                      <td key={column.key} className={alignClass(column.align)}>
                        {column.render
                          ? column.render(row)
                          : formatFallback(row[column.key])}
                      </td>
                    ))}
                    {rowActions ? (
                      <td className="text-right" data-actions-col>
                        <div className="flex justify-end gap-1.5">
                          {rowActions(row)}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout — below md */}
          <ul className="flex flex-col gap-2 md:hidden">
            {pageRows.map((row) => {
              const [primary, ...rest] = columns.filter(
                (column) => !column.hideOnMobile
              );

              return (
                <li
                  key={getRowId(row)}
                  className="rounded-card border border-line bg-surface p-3.5"
                >
                  {primary ? (
                    <p className="text-sm font-semibold text-ink">
                      {primary.render
                        ? primary.render(row)
                        : formatFallback(row[primary.key])}
                    </p>
                  ) : null}

                  <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                    {rest.map((column) => (
                      <div key={column.key} className="col-span-2 flex gap-3">
                        <dt className="w-28 shrink-0 text-2xs font-semibold uppercase tracking-wide text-ink-muted">
                          {column.label}
                        </dt>
                        <dd className="min-w-0 flex-1 break-words text-xs text-ink-soft">
                          {column.render
                            ? column.render(row)
                            : formatFallback(row[column.key])}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {rowActions ? (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                      {rowActions(row)}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            summary={`Showing ${rangeStart}–${rangeEnd} of ${filtered.length}`}
          />
        </>
      )}
    </div>
  );
}

/** Renders empty API values as an em dash instead of "null"/"undefined". */
function formatFallback(value: unknown): ReactNode {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

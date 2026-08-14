'use client';

import type { ReactNode } from 'react';
import { Layers } from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import {
  DataTable as BaseDataTable,
  type DataTableColumn,
} from '@/app/src/components/ui/DataTable';
import { Badge } from '@/app/src/components/ui/Badge';
import { formatNumber } from '@/app/src/lib/format';

export type { DataTableColumn };

interface TableCardProps<T> {
  title: string;
  description?: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  pageSize?: number;
  icon?: ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Per-row controls rendered in a trailing Actions column. */
  rowActions?: (row: T) => ReactNode;
}

/**
 * Card-framed table for the dashboard: heading, record count and the shared
 * DataTable (search, pagination, mobile card layout, state handling).
 */
export default function TableCard<T>({
  title,
  description,
  columns,
  rows,
  getRowId,
  pageSize = 8,
  icon,
  loading = false,
  error = null,
  onRetry,
  emptyTitle,
  emptyDescription,
  rowActions,
}: TableCardProps<T>) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title={title}
        description={description}
        icon={icon ?? <Layers className="size-4" />}
        metric={
          !loading && !error ? (
            <Badge tone="brand">
              {formatNumber(rows.length)}{' '}
              {rows.length === 1 ? 'record' : 'records'}
            </Badge>
          ) : undefined
        }
      />

      <CardBody className="flex-1">
        <BaseDataTable
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          pageSize={pageSize}
          loading={loading}
          error={error}
          onRetry={onRetry}
          searchable={rows.length > pageSize}
          searchPlaceholder={`Search ${title.toLowerCase()}…`}
          emptyTitle={emptyTitle ?? `No ${title.toLowerCase()} yet`}
          emptyDescription={emptyDescription}
          rowActions={rowActions}
        />
      </CardBody>
    </Card>
  );
}

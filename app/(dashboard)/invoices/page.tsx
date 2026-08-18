'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, FilePlus2, Pencil, Receipt, RefreshCw } from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';

import {
  DataTable,
  type DataTableColumn,
} from '@/app/src/components/ui/DataTable';

import { Badge } from '@/app/src/components/ui/Badge';

import Button, { IconButton } from '@/app/src/components/ui/Button';

import { formatDate, formatMoneyExact } from '@/app/src/lib/format';

import { useAsyncData } from '../hooks/useAsyncData';
import { fetchInvoices } from '../services/invoices';

import type { InvoiceSummary, InvoiceStatus } from '../types/invoice';

import { STATUS_TONES } from './components/statusTone';

export default function InvoiceHistoryPage() {
  const router = useRouter();

  const invoices = useAsyncData<InvoiceSummary[]>(fetchInvoices, {
    key: 'invoices',
    fallbackMessage: 'Invoices could not be loaded.',
  });

  const rows = invoices.data ?? [];

  const columns: DataTableColumn<InvoiceSummary>[] = [
    {
      key: 'invoiceNo',
      label: 'Invoice number',

      render: (row) => (
        <Link
          href={`/invoices/${row.id}`}
          className="font-semibold text-brand-700 underline-offset-2 hover:underline"
        >
          {row.invoiceNo || row.id}
        </Link>
      ),
    },

    {
      key: 'customer',
      label: 'Customer',

      render: (row) => {
        const customer =
          row.customer && typeof row.customer === 'object'
            ? row.customer
            : null;

        const customerName =
          customer?.companyName ||
          customer?.attentionPoc ||
          customer?.email ||
          '—';

        return (
          <span className="block max-w-[16rem] truncate" title={customerName}>
            {customerName}
          </span>
        );
      },
    },

    {
      key: 'date',
      label: 'Date',

      render: (row) => (
        <span className="whitespace-nowrap">{formatDate(row.date)}</span>
      ),
    },

    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      notSearchable: true,

      render: (row) => (
        <span className="tabular whitespace-nowrap font-semibold text-ink">
          {formatMoneyExact(row.amount)}
        </span>
      ),
    },

    {
      key: 'status',
      label: 'Status',
      align: 'right',

      render: (row) => {
        const status = row.status as InvoiceStatus | null | undefined;

        const tone =
          status && STATUS_TONES[status] ? STATUS_TONES[status] : 'neutral';

        return (
          <Badge tone={tone} dot>
            {status ?? 'Unknown'}
          </Badge>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Billing"
        title="Invoice history"
        description="Every invoice raised for Zamra Water customers, with its status and balance."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              label="Refresh"
              loadingLabel="Refreshing…"
              loading={invoices.refreshing}
              onClick={invoices.refresh}
              icon={<RefreshCw className="size-3.5" />}
            />

            <Button
              type="button"
              label="New invoice"
              icon={<FilePlus2 className="size-4" />}
              onClick={() => router.push('/bill-generate')}
            />
          </div>
        }
      />

      <Card as="section">
        <CardHeader
          title="Saved invoices"
          description="Search by invoice number or customer, then open one to view it"
          icon={<Receipt className="size-4" />}
          metric={
            !invoices.loading && !invoices.error ? (
              <Badge tone="brand">
                {rows.length} {rows.length === 1 ? 'invoice' : 'invoices'}
              </Badge>
            ) : undefined
          }
        />

        <CardBody>
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            pageSize={10}
            loading={invoices.loading}
            error={invoices.error}
            onRetry={invoices.refresh}
            searchable={rows.length > 0}
            searchPlaceholder="Search invoices…"
            emptyTitle="No invoices to show"
            emptyDescription="Invoices you generate will be listed here."
            emptyAction={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                label="Create an invoice"
                icon={<FilePlus2 className="size-3.5" />}
                onClick={() => router.push('/bill-generate')}
              />
            }
            rowActions={(row) => (
              <>
                <IconButton
                  variant="secondary"
                  size="sm"
                  label={`View invoice ${row.invoiceNo || row.id}`}
                  icon={<Eye className="size-3.5" />}
                  onClick={() => router.push(`/invoices/${row.id}`)}
                />

                <IconButton
                  variant="secondary"
                  size="sm"
                  label={`Update invoice ${row.invoiceNo || row.id}`}
                  icon={<Pencil className="size-3.5" />}
                  onClick={() => router.push(`/invoices/${row.id}/edit`)}
                />
              </>
            )}
          />
        </CardBody>
      </Card>
    </PageContainer>
  );
}

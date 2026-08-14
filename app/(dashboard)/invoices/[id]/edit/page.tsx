'use client';

import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Card, CardBody } from '@/app/src/components/ui/Card';
import { ErrorState } from '@/app/src/components/ui/StatePlaceholders';
import { Skeleton } from '@/app/src/components/ui/Skeleton';
import Button from '@/app/src/components/ui/Button';

import { useAsyncData } from '../../../hooks/useAsyncData';
import { fetchInvoiceById } from '../../../services/invoices';
import type { InvoiceRecord } from '../../../types/invoice';
import InvoiceEditForm from '../../components/InvoiceEditForm';

/** Edit form for a saved invoice, prefilled from the record itself. */
export default function InvoiceEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';

  const load = useCallback(
    (options: { forceRefresh: boolean }) => fetchInvoiceById(id, options),
    [id]
  );

  const invoice = useAsyncData<InvoiceRecord>(load, {
    key: `invoice:${id}`,
    fallbackMessage: 'That invoice could not be loaded.',
  });

  const backToDetail = () => router.push(`/invoices/${id}`);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Billing"
        title={
          invoice.data?.invoiceNo
            ? `Update invoice ${invoice.data.invoiceNo}`
            : 'Update invoice'
        }
        description="Change the saved details, then save to update the record."
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            label="Back to invoice"
            icon={<ArrowLeft className="size-3.5" />}
            onClick={backToDetail}
          />
        }
      />

      {invoice.loading ? (
        <Card as="section">
          <CardBody className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardBody>
        </Card>
      ) : invoice.error ? (
        <Card as="section">
          <CardBody>
            <ErrorState
              title="This invoice could not be loaded"
              description={invoice.error}
              onRetry={invoice.refresh}
            />
          </CardBody>
        </Card>
      ) : invoice.data ? (
        <InvoiceEditForm
          invoice={invoice.data}
          onCancel={backToDetail}
          onSaved={() => {
            // The service has already dropped the cached copies; refresh pulls
            // the saved record so the detail page shows the new figures.
            invoice.refresh();
            backToDetail();
          }}
        />
      ) : null}
    </PageContainer>
  );
}

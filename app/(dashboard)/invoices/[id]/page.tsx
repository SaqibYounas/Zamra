'use client';

import { useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Card, CardBody } from '@/app/src/components/ui/Card';
import { ErrorState } from '@/app/src/components/ui/StatePlaceholders';
import { Skeleton } from '@/app/src/components/ui/Skeleton';
import Button from '@/app/src/components/ui/Button';
import ConfirmationModal from '@/app/src/components/ui/ConfirmationModal';

import { useAsyncData } from '../../hooks/useAsyncData';
import { deleteInvoice, fetchInvoiceById } from '../../services/invoices';
import type { InvoiceRecord } from '../../types/invoice';
import InvoicePreview from '../components/InvoicePreview';

/** One saved invoice, with the actions that can be taken on it. */
export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(
    (options: { forceRefresh: boolean }) => fetchInvoiceById(id, options),
    [id]
  );

  const invoice = useAsyncData<InvoiceRecord>(load, {
    key: `invoice:${id}`,
    fallbackMessage: 'That invoice could not be loaded.',
  });

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');

    const response = await deleteInvoice(id);

    if (response?.success === false) {
      setDeleting(false);
      setDeleteError(response.message || 'The invoice could not be deleted.');
      return;
    }

    // Leave `deleting` set: the redirect unmounts this page, and clearing it
    // first would flash an enabled button.
    setConfirming(false);
    router.replace('/invoices');
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Billing"
        title={
          invoice.data?.invoiceNo
            ? `Invoice ${invoice.data.invoiceNo}`
            : 'Invoice'
        }
        description="The saved document, exactly as it was raised."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              label="Back"
              icon={<ArrowLeft className="size-3.5" />}
              onClick={() => router.push('/invoices')}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              label="Update"
              icon={<Pencil className="size-3.5" />}
              disabled={!invoice.data}
              onClick={() => router.push(`/invoices/${id}/edit`)}
            />
            <Button
              type="button"
              variant="danger"
              size="sm"
              label="Delete"
              icon={<Trash2 className="size-3.5" />}
              disabled={!invoice.data}
              onClick={() => {
                setDeleteError('');
                setConfirming(true);
              }}
            />
          </div>
        }
      />

      {invoice.loading ? (
        <Card as="section">
          <CardBody className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
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
        <InvoicePreview invoice={invoice.data} />
      ) : null}

      <ConfirmationModal
        open={confirming}
        title="Delete this invoice?"
        message={
          deleteError ||
          `Invoice ${invoice.data?.invoiceNo || id} will be permanently removed, and the sale it recorded will no longer be counted.`
        }
        confirmText="Delete invoice"
        loadingText="Deleting…"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirming(false);
          setDeleteError('');
        }}
      />
    </PageContainer>
  );
}

'use client';

import { Download, Pencil } from 'lucide-react';

import { Modal } from '@/app/src/components/ui/Modal';
import Button from '@/app/src/components/ui/Button';
import { InvoiceTemplate } from './InvoiceTemplate';
import type { InvoiceData } from '../../types/invoice';

/**
 * The finished document before it is committed, using the same template the
 * export rasterises. Scaled, not reflowed, so proportions stay true.
 */
export default function InvoicePreviewModal({
  open,
  onClose,
  onConfirm,
  submitting,
  invoiceData,
  logisticFields,
  subtotal,
  taxAmount,
  totalAmount,
  balanceDue,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  invoiceData: InvoiceData;
  logisticFields: { key: string; label: string }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  balanceDue: number;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Invoice ${invoiceData.meta.invoiceNo || 'preview'}`}
      description="This is exactly how the PDF will look. Nothing has been saved yet."
      size="xl"
      dismissable={!submitting}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            label="Back to edit"
            icon={<Pencil className="size-4" />}
            onClick={onClose}
            disabled={submitting}
            className="sm:w-auto"
            fullWidth
          />
          <Button
            type="button"
            label="Save & download PDF"
            loadingLabel="Saving…"
            loading={submitting}
            icon={<Download className="size-4" />}
            onClick={onConfirm}
            className="sm:w-auto"
            fullWidth
          />
        </>
      }
    >
      {/* The outer box reserves the scaled height; without it the transform
          would leave a large gap below the page. */}
      <div className="scroll-x flex justify-center">
        <div className="h-[560px] w-[400px] shrink-0 sm:h-[700px] sm:w-[500px]">
          <div className="origin-top-left scale-[0.5] sm:scale-[0.625]">
            <div className="shadow-raised">
              <InvoiceTemplate
                invoiceData={invoiceData}
                logisticFields={logisticFields}
                subtotal={subtotal}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
                balanceDue={balanceDue}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

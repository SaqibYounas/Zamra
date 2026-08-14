import type { BadgeTone } from '@/app/src/components/ui/Badge';
import type { InvoiceStatus } from '../../types/invoice';

/** Badge tone per settlement state; shared by the history table and preview. */
export const STATUS_TONES: Record<InvoiceStatus, BadgeTone> = {
  Paid: 'success',
  Pending: 'warning',
  Unpaid: 'danger',
};

export const INVOICE_STATUSES: InvoiceStatus[] = ['Paid', 'Pending', 'Unpaid'];

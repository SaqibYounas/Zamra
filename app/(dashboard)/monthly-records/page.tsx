import type { Metadata } from 'next';
import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import TimelineTable from './components/TimelineTable';

export const metadata: Metadata = {
  title: 'Monthly Records',
  description:
    'Day-by-day stock, price, sales, cost and profit for every bottle size.',
};

/**
 * Server component: only the ledger itself is interactive, so the page frame
 * stays out of the client bundle.
 */
export default function MonthlyRecordsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Overview"
        title="Monthly records"
        description="A day-by-day ledger of stock, pricing, sales, cost and profit. Switch months, focus a single bottle size, or export the period as PDF or CSV."
      />

      <TimelineTable />
    </PageContainer>
  );
}

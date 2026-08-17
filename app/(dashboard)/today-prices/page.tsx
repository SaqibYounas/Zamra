import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import TodayRatesClient from './components/TodayRatesClient';

export default function TodayRatesPage() {
  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Pricing & Rates"
        title="Today's Rates"
        description="View current active selling rates, production costs, and profit margins for all bottle types."
      />

      <TodayRatesClient />
    </PageContainer>
  );
}

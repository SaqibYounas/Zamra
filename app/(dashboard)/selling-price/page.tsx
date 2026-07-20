'use client';

import { useEffect, useState } from 'react';
import SellingPriceForm from './component/SellingPriceForm';
import TodayPriceTable from './component/PriceTable';
import { fetchActivePrices } from '../services/priceManagement';

interface Price {
  id: number;
  bottleType: string;
  perBottlePrice: string;
  labelCapPrice: string;
  otherExpenses: string;
  isActive: boolean;
}

export default function SellingPricePage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  async function getPrices() {
    try {
      setLoading(true);

      const data = await fetchActivePrices();

      setPrices(data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getPrices();
  }, []);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-5xl
        px-3
        sm:px-6
        lg:px-8
        pt-20
        sm:pt-24
        lg:pt-10
      "
    >
      <TodayPriceTable prices={prices} loading={loading} />

      <div className="mt-5 sm:mt-8">
        <SellingPriceForm prices={prices} />
      </div>
    </main>
  );
}

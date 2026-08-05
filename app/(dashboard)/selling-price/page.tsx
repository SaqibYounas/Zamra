'use client';

import { useEffect, useState } from 'react';
import SellingPriceForm from './component/SellingPriceForm';
import TodayPriceTable from './component/PriceTable';
import { fetchActivePrices } from '../services/priceManagement';
import { SellingPrice } from './types';

export default function SellingPricePage() {
  const [prices, setPrices] = useState<SellingPrice[]>([]);
  const [loading, setLoading] = useState(true);

  async function getPrices() {
    try {
      setLoading(true);

      const data = await fetchActivePrices();

      setPrices(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPrices();
  }, []);

  return (
    <main
      className="
    min-h-screen
    w-full
    flex
    items-center
    justify-center
    px-3
    sm:px-6
    lg:px-8
    py-10
  "
    >
      <div
        className="
      w-full
      max-w-5xl
      mx-auto
    "
      >
        <TodayPriceTable prices={prices} loading={loading} />

        <div className="mt-5 sm:mt-8">
          <SellingPriceForm prices={prices} />
        </div>
      </div>
    </main>
  );
}

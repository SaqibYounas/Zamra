'use client';

import { useEffect, useState } from 'react';
import { fetchActivePrices } from '../../services/priceManagement';

interface Price {
  id: number;
  bottleType: 'SMALL' | 'MEDIUM' | 'LARGE' | 'JAR';
  perBottlePrice: number;
  labelCapPrice: number;
  otherExpenses: number;
  isActive: boolean;
}

export default function TodayPriceTable() {
  const bottles = ['500ml', '1 Liter', '1.5 Liter', '19 Liter'];

  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, string>>({});

  const bottleLabelMap: Record<Price['bottleType'], string> = {
    SMALL: '500ml',
    MEDIUM: '1 Liter',
    LARGE: '1.5 Liter',
    JAR: '19 Liter',
  };

  async function getActivePrices() {
    try {
      setLoading(true);

      const data = await fetchActivePrices();

      const formattedPrices: Record<string, string> = {};

      if (Array.isArray(data)) {
        data.forEach((item: Price) => {
          const label = bottleLabelMap[item.bottleType];

          if (label) {
            formattedPrices[label] = `Rs ${item.perBottlePrice}`;
          }
        });
      }

      setPrices(formattedPrices);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getActivePrices();
  }, []);

  return (
    <div
      className="
        mx-auto 
        w-full 
        max-w-sm 
        overflow-x-auto 
        rounded-2xl 
        bg-white 
        p-3 
        shadow-md 
        ring-1 
        ring-slate-200
        sm:max-w-md 
        sm:p-5 
        lg:max-w-full 
        lg:p-6
      "
    >
      <h2 className="mb-3 text-center text-base font-bold text-slate-900 sm:mb-4 sm:text-lg lg:text-xl">
        Today Per Bottle Price
      </h2>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full table-fixed">
          <thead className="bg-blue-50">
            <tr>
              {bottles.map((type) => (
                <th
                  key={type}
                  className="
                    px-2 
                    py-2.5 
                    text-center 
                    text-[11px] 
                    font-semibold 
                    text-blue-700
                    sm:px-3 
                    sm:py-3 
                    sm:text-xs
                  "
                >
                  {type}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-100">
              {bottles.map((type) => (
                <td
                  key={type}
                  className="
                    px-2 
                    py-3 
                    text-center 
                    text-xs 
                    font-semibold 
                    text-slate-700
                    sm:px-3 
                    sm:py-4 
                    sm:text-sm
                  "
                >
                  {loading ? (
                    <div className="mx-auto h-3.5 w-12 animate-pulse rounded bg-slate-200 sm:h-4 sm:w-16" />
                  ) : (
                    prices[type] || 'Rs 0'
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

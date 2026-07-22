'use client';

import { useEffect, useState } from 'react';
import GraphCard from '../../src/components/graph/Graph';
import { getStock } from '../services/stockManagement';
import { MetricType, StockMetrics } from '../types/types';
import { Loader2 } from 'lucide-react';

const metrics: MetricType[] = [
  'Monthly Profit',
  'Today Stock',
  'Total Cost',
  'Profit Today',
  'Overall Stock',
];

export default function DashboardPage() {
  const [stockData, setStockData] = useState<StockMetrics | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const stock = await getStock();
        // getStock may return an error object { success: boolean; message: string }
        if (stock && typeof stock === 'object' && 'success' in stock) {
          const errorResponse = stock as { success: boolean; message?: string };
          // handle error response

          console.error(
            'Error fetching stock data:',
            errorResponse.message || stock
          );
        } else {
          setStockData(stock as StockMetrics);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <span className="text-5xl animate-bounce">💧</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-6 sm:px-6 lg:px-8 lg:pt-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-slate-800">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {metrics.map((metric) => (
            <GraphCard key={metric} title={metric} rawStockData={stockData} />
          ))}
        </div>
      </main>
    </div>
  );
}

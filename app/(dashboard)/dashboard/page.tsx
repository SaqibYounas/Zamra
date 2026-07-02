'use client';

import { useEffect, useState } from 'react';
import GraphCard from '../../src/components/graph/Graph';
import { getStock } from '../services/stockManagement';
import { MetricType, StockMetrics } from '../types/types';

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin" />
          <p className="text-gray-600 font-semibold text-lg">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="lg:text-3xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
          Business Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <GraphCard key={metric} title={metric} rawStockData={stockData} />
          ))}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Layers, Receipt, TrendingUp } from 'lucide-react';
import GraphCard from './components/Graph';
import StatCard from './components/StatCard';
import DataTable, { DataTableColumn } from './components/DataTable';
import ProfitReport from './components/profitReport';
import { fetchCustomers } from '../services/getCustomers';
import { getStock } from '../services/stockManagement';
import {
  Customer,
  ShippingAddress,
  StockMetrics,
  StockBottleType,
} from './types';
import { fetchShipping } from '../services/getShipping';

const BOTTLE_LABELS: StockBottleType[] = [
  '500ml',
  '1.5L',
  '5L',
  '19L',
  '19L Refill',
];

const customerColumns: DataTableColumn<Customer>[] = [
  { key: 'id', label: '#' },
  { key: 'companyName', label: 'Company' },
  { key: 'attentionPoc', label: 'Contact Person' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'city', label: 'City' },
];

const shippingColumns: DataTableColumn<ShippingAddress>[] = [
  { key: 'id', label: '#' },
  { key: 'warehouseName', label: 'Warehouse' },
  { key: 'attentionTo', label: 'Contact Person' },
  { key: 'phone', label: 'Phone' },
  { key: 'deliveryAddress', label: 'Address' },
];

function sumBottles(metric?: Partial<Record<StockBottleType, number>>) {
  if (!metric) return 0;
  return BOTTLE_LABELS.reduce((sum, size) => sum + (metric[size] ?? 0), 0);
}

export default function DashboardPage() {
  const [stockData, setStockData] = useState<StockMetrics | undefined>(
    undefined
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [customersResponse, shippingResponse, stockResponse] =
          await Promise.all([fetchCustomers(), fetchShipping(), getStock()]);

        setCustomers(Array.isArray(customersResponse) ? customersResponse : []);
        setShippingAddresses(
          Array.isArray(shippingResponse) ? shippingResponse : []
        );

        if (
          stockResponse &&
          typeof stockResponse === 'object' &&
          !('success' in stockResponse)
        ) {
          setStockData(stockResponse as StockMetrics);
        } else {
          console.error('Stock loading error', stockResponse);
        }
      } catch (error) {
        console.error('Table loading error', error);
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

  const totalProfitOverall = (stockData?.monthlyProfitHistory ?? []).reduce(
    (sum, v) => sum + v,
    0
  );
  const totalCost = sumBottles(stockData?.costs);
  const totalStock = sumBottles(stockData?.overallStock);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-6 sm:px-6 lg:px-8 lg:pt-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-slate-800">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
          <StatCard
            label="Total Profit Overall"
            value={totalProfitOverall}
            icon={<TrendingUp className="w-5 h-5 text-yellow-600" />}
            isCurrency
          />
          <StatCard
            label="Total Cost"
            value={totalCost}
            icon={<Receipt className="w-5 h-5 text-rose-600" />}
            isCurrency
          />
          <StatCard
            label="Total Stock"
            value={totalStock}
            icon={<Layers className="w-5 h-5 text-sky-500" />}
            unit=" units"
          />
        </div>

        <div className="mb-10">
          <ProfitReport />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-10">
          <GraphCard
            title="Overall Stock"
            label="Total Stock"
            rawStockData={stockData}
          />
          <GraphCard
            title="Selling Price Today"
            label="Current Selling Price (Bottle Wise)"
            rawStockData={stockData}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DataTable
            title="Customers"
            columns={customerColumns}
            rows={customers}
            pageSize={10}
          />
          <DataTable
            title="Shipping Addresses"
            columns={shippingColumns}
            rows={shippingAddresses}
            pageSize={10}
          />
        </div>
      </main>
    </div>
  );
}

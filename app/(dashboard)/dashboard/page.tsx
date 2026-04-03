'use client';

import GraphCard from '../../src/components/graph/Graph';

const metrics = [
  'Monthly Profit',
  'Today Stock',
  'Total Cost',
  'Profit Today',
  'Overall Stock',
] as const;

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 md:pl-64 lg:pl-80 lg:pr-6 p-6">
        <h1 className="lg:text-3xl sm:text-2xl font-bold text-center mt-6 md:mt-0 mb-6 text-gray-800">
          Business Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <GraphCard key={metric} title={metric} />
          ))}
        </div>
      </main>
    </div>
  );
}

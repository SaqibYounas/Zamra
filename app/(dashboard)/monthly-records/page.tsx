'use client';

import TimelineTable from './components/TimelineTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-6 sm:px-6 lg:px-8 lg:pt-12">
        <h1 className="mb-8 text-center text-2xl font-bold text-slate-800 sm:text-3xl">
          Stock Timeline
        </h1>

        <TimelineTable />
      </main>
    </div>
  );
}

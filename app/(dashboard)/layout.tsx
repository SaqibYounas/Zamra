'use client';

import { useState } from 'react';
import Sidebar from '../src/components/sidebar/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main
        className={`flex-1 bg-slate-100 transition-all duration-300 overflow-y-auto ${
          sidebarOpen ? 'md:pl-64' : 'md:pl-20'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

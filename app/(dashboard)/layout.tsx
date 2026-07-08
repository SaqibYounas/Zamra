'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../src/components/sidebar/Sidebar';
import { ChatbotWidget } from '../src/components/chatbot/ChatbotWidget';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const updateSidebarState = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    updateSidebarState();
    window.addEventListener('resize', updateSidebarState);

    return () => window.removeEventListener('resize', updateSidebarState);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main
        className={`flex-1 bg-slate-500 transition-all duration-300 overflow-y-auto ${
          sidebarOpen ? 'md:pl-64' : 'md:pl-20'
        }`}
      >
        {children}
      </main>

      <ChatbotWidget />
    </div>
  );
}

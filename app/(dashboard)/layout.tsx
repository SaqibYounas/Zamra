'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../src/components/layout/Sidebar';
import { TopBar } from '../src/components/layout/TopBar';
import { ChatbotWidget } from '../src/components/chatbot/ChatbotWidget';
import { sidebarCollapsed } from '../src/lib/preferences';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSyncExternalStore(
    sidebarCollapsed.subscribe,
    sidebarCollapsed.get,
    sidebarCollapsed.getServerSnapshot
  );

  const toggleCollapsed = useCallback(() => sidebarCollapsed.toggle(), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, pathname]);

  return (
    <div className="min-h-dvh bg-canvas">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />

      <div
        className={`flex min-h-dvh flex-col transition-[padding] duration-200 ease-out ${
          collapsed ? 'md:pl-[4.75rem]' : 'md:pl-[16.5rem]'
        }`}
      >
        <TopBar onOpenMobile={() => setMobileOpen(true)} />

        <main id="main" className="flex-1">
          {children}
        </main>
      </div>

      <ChatbotWidget />
    </div>
  );
}

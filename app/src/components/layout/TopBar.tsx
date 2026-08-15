'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Droplets, Menu } from 'lucide-react';
import { findNavItem } from '../../lib/navigation';
import { ThemeToggle } from '../ui/ThemeToggle';

export function TopBar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const pathname = usePathname();
  const current = findNavItem(pathname);

  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const todayLabel = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open navigation"
        className="btn btn-secondary size-9 shrink-0 p-0 md:hidden"
      >
        <Menu className="size-4" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-sm">
          <li className="hidden sm:block">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-ink-muted transition-colors hover:text-brand-600"
            >
              <Droplets className="size-4" />
              <span className="font-medium">Zamra</span>
            </Link>
          </li>

          {current ? (
            <>
              <li className="hidden sm:block" aria-hidden>
                <ChevronRight className="size-3.5 text-ink-faint" />
              </li>
              <li className="min-w-0">
                <span
                  aria-current="page"
                  className="block truncate font-semibold text-ink"
                >
                  {current.label}
                </span>
              </li>
            </>
          ) : null}
        </ol>
      </nav>
      <time
        dateTime={todayISO}
        suppressHydrationWarning
        className="hidden shrink-0 items-center rounded-full border border-line bg-surface-sunken px-3 py-1.5 text-2xs font-semibold text-ink-muted sm:inline-flex"
      >
        {todayLabel}
      </time>

      <ThemeToggle />

      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-marine-900 text-2xs font-semibold text-brand-200"
        title="Signed in as administrator"
      >
        Sufyan
      </span>
    </header>
  );
}

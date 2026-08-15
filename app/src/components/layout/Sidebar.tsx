'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Building2,
  ChevronsLeft,
  ChevronsRight,
  Droplets,
  FileText,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Scale,
  Tags,
  X,
} from 'lucide-react';

import { showApiToast } from '../../lib/apiToast';
import { clearRequestCache } from '@/app/(dashboard)/services/requestCache';
import { NAV_SECTIONS, type NavIconName } from '../../lib/navigation';
import ConfirmationModal from '../ui/ConfirmationModal';

const ICONS: Record<NavIconName, React.ElementType> = {
  dashboard: LayoutDashboard,
  cost: Scale,
  tag: Tags,
  production: Gauge,
  records: FileText,
  invoice: ReceiptText,
  invoices: FileText,
  company: Building2,
  password: KeyRound,
};

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [logoutModal, setLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await axios.post('/api/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error(error);
    } finally {
      clearRequestCache();
      showApiToast(
        'You have been logged out successfully.',
        'success',
        'Signed out'
      );

      setLogoutLoading(false);
      setLogoutModal(false);
      router.replace('/');
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onCloseMobile}
        aria-hidden
        className={`fixed inset-0 z-40 bg-marine-950/50 backdrop-blur-[2px] transition-opacity duration-200 md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-marine-900 bg-marine-950 text-marine-100 transition-[width,transform] duration-200 ease-out
          ${collapsed ? 'md:w-[4.75rem]' : 'md:w-[16.5rem]'}
          w-[17rem] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-marine-900 px-4">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-offset-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-field bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/25">
              <Droplets className="size-[1.15rem]" />
            </span>

            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">
                  Zamra Water
                </span>
                <span className="block truncate text-2xs text-marine-300">
                  Operations Portal
                </span>
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="ml-auto flex size-8 items-center justify-center rounded-md text-marine-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Sections */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-5 last:mb-0">
              {collapsed ? (
                <div className="mx-2 mb-2 h-px bg-marine-900" aria-hidden />
              ) : (
                <p className="mb-1.5 px-2.5 text-2xs font-semibold uppercase tracking-[0.12em] text-marine-400">
                  {section.title}
                </p>
              )}

              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = ICONS[item.icon];
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        aria-current={isActive ? 'page' : undefined}
                        title={collapsed ? item.label : undefined}
                        className={`group relative flex items-center gap-2.5 rounded-field px-2.5 py-2.5 text-[0.8125rem] font-medium transition-colors ${
                          collapsed ? 'justify-center' : ''
                        } ${
                          isActive
                            ? 'bg-brand-500/15 text-white'
                            : 'text-marine-200 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {isActive ? (
                          <span
                            className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand-400"
                            aria-hidden
                          />
                        ) : null}

                        <Icon
                          className={`size-[1.05rem] shrink-0 ${
                            isActive
                              ? 'text-brand-300'
                              : 'text-marine-400 group-hover:text-brand-300'
                          }`}
                        />

                        {!collapsed ? (
                          <span className="truncate">{item.label}</span>
                        ) : (
                          <span className="sr-only">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-marine-900 p-2.5">
          <button
            type="button"
            onClick={() => setLogoutModal(true)}
            title={collapsed ? 'Sign out' : undefined}
            className={`flex w-full items-center gap-2.5 rounded-field px-2.5 py-2.5 text-[0.8125rem] font-medium text-marine-200 transition-colors hover:bg-danger/15 hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="size-[1.05rem] shrink-0" />
            {!collapsed ? (
              <span>Sign out</span>
            ) : (
              <span className="sr-only">Sign out</span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            className={`mt-0.5 hidden w-full items-center gap-2.5 rounded-field px-2.5 py-2.5 text-[0.8125rem] font-medium text-marine-400 transition-colors hover:bg-white/5 hover:text-white md:flex ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {collapsed ? (
              <ChevronsRight className="size-[1.05rem] shrink-0" />
            ) : (
              <ChevronsLeft className="size-[1.05rem] shrink-0" />
            )}
            {!collapsed ? (
              <span>Collapse</span>
            ) : (
              <span className="sr-only">Expand navigation</span>
            )}
          </button>
        </div>
      </aside>

      <ConfirmationModal
        open={logoutModal}
        tone="danger"
        title="Sign out of Zamra?"
        message="You will need to sign in again with your admin credentials to access the portal."
        confirmText="Sign out"
        loadingText="Signing out…"
        cancelText="Stay signed in"
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModal(false)}
      />
    </>
  );
}

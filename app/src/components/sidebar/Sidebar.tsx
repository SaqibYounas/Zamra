'use client';

import React, { useState } from 'react';
import { Droplets, Menu, X } from 'lucide-react';
import {
  HiOutlineHome,
  HiOutlineLockClosed,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { TbReport } from 'react-icons/tb';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { clearAuthTokenFromAxios } from '../../lib/auth';
import { showApiToast } from '../../lib/apiToast';
import ConfirmationModal from '../confirmation/ConfirmationModal';

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
};

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  setActiveTab,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [logoutModal, setLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <HiOutlineHome size={20} />,
      href: '/dashboard',
    },
    {
      id: 'price-management',
      label: 'Price Management',
      icon: <HiOutlineCurrencyRupee size={20} />,
      href: '/price',
    },
    {
      id: 'selling-price',
      label: 'Selling Price',
      icon: <FaFileInvoiceDollar size={20} />,
      href: '/selling-price',
    },
    {
      id: 'production-quantity',
      label: 'Production Quantity',
      icon: <MdOutlineProductionQuantityLimits size={20} />,
      href: '/production',
    },
    {
      id: 'monthly-records',
      label: 'Monthly Records',
      icon: <TbReport size={20} />,
      href: '/monthly-records',
    },
    {
      id: 'bill-generate',
      label: 'Bill Generate',
      icon: <FaFileInvoiceDollar size={20} />,
      href: '/bill-generate',
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <HiOutlineClipboardList size={20} />,
      href: '/invoices',
    },
    {
      id: 'company-info',
      label: 'Company Info',
      icon: <HiOutlineOfficeBuilding size={20} />,
      href: '/company-info',
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: <HiOutlineLockClosed size={20} />,
      href: '/change-password',
    },
  ];

  const handleNavigation = (item: SidebarItem) => {
    router.push(item.href);
    setActiveTab(item.id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      await axios.post('/api/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error(error);
    } finally {
      clearAuthTokenFromAxios();

      showApiToast(
        'You have been logged out successfully.',
        'success',
        'Logged out'
      );

      setLogoutLoading(false);
      setLogoutModal(false);

      router.replace('/');
    }
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-linear-to-r from-indigo-600 to-cyan-500 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
            <Droplets size={20} />
          </div>
          <span className="font-semibold">Zamra Water</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/20 transition"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed ring-1 top-0 left-0 h-full z-30 flex flex-col bg-linear-to-b from-slate-50 via-white to-blue-50 text-slate-700 transition-all duration-300 ease-in-out overflow-hidden shadow-2xl border-r border-blue-100 ${
          sidebarOpen
            ? 'w-64 translate-x-0'
            : 'w-20 -translate-x-full md:translate-x-0'
        }`}
      >
        <div className="px-5 py-6 flex items-center gap-3 border-b border-slate-200 ring-1">
          {' '}
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-200 shrink-0">
            <Droplets size={22} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-base text-slate-900">Zamra Water</p>
              <p className="text-xs text-blue-500">Operations Portal</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-5 px-3 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`group w-full flex items-center gap-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center p-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span
                  className={`flex items-center justify-center ${
                    isActive
                      ? '!text-white'
                      : '!text-slate-500 group-hover:!text-blue-600'
                  }`}
                >
                  {item.icon}
                </span>

                {sidebarOpen && (
                  <span
                    className={`text-sm font-medium whitespace-nowrap ${
                      isActive
                        ? '!text-white'
                        : '!text-slate-700 group-hover:!text-blue-700'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 ring-1 ">
          <button
            onClick={() => setLogoutModal(true)}
            className={`w-full flex items-center gap-3 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white font-medium shadow-md hover:opacity-90 transition cursor-pointer ${
              sidebarOpen ? 'justify-start px-4' : 'justify-center'
            }`}
          >
            <HiOutlineLockClosed size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:bg-blue-100 hover:text-blue-700 transition cursor-pointer"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </aside>

      <ConfirmationModal
        open={logoutModal}
        title="Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Yes, Logout"
        cancelText="No"
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModal(false)}
      />
    </>
  );
};

export default Sidebar;

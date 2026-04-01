'use client';

import React from 'react';
import {
  Droplets,
  LayoutDashboard,
  ShoppingBag,
  Menu,
  X,
  DollarSign,
  Package,
} from 'lucide-react';
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
};

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) => {
  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: 'price-management',
      label: 'Price Management',
      icon: <DollarSign size={20} />,
    },
    {
      id: 'production-quantity',
      label: 'Production Quantity',
      icon: <Package size={20} />,
    },
  ];
  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-blue-900 text-white shadow">
        <span className="font-bold">Zamra Water</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black/40 z-20 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full z-30
          flex flex-col bg-blue-900 text-white
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? 'w-64' : 'w-20'}
          md:w-${sidebarOpen ? '64' : '20'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center gap-3 border-b border-sky-800">
          <div className="bg-sky-500 p-2 rounded-lg flex-shrink-0">
            <Droplets size={24} />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg whitespace-nowrap">
              Zamra Water
            </span>
          )}
        </div>

        <nav className="flex-1 py-6 px-1 md:px-3 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 py-3 rounded-xl transition-all duration-300 cursor-pointer
                ${sidebarOpen ? 'justify-start px-4' : 'justify-center'}
                ${
                  activeTab === item.id
                    ? 'bg-sky-600 text-white shadow-lg'
                    : 'text-blue-200 hover:bg-sky-800 hover:text-white'
                }
              `}
            >
              {item.icon}
              {sidebarOpen && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800 hidden md:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

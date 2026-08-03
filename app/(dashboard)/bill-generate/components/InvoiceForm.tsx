'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  Receipt,
  Building2,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  Percent,
} from 'lucide-react';
import WaterInputField from '../../../src/components/inputFields/InputField';
import Button from '../../../src/components/button/Button';
import Dropdown from '../../../src/components/dropdown/Dropdown';
import RsIcon from '@/public/RupeesIcon';
import { InvoiceData, ObjectSectionKey, InvoiceItem } from '../../types/types';
import { waterTypes } from '../../data/waterTypes';

export interface CustomerRecord {
  id: number | string;
  name: string;
  attn?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
}

interface sellingPriceRequestBody {
  sellingPrice: string;
  priceManagementId: number;
  priceManagement: {
    bottleType: string;
  };
}

export interface ShippingRecord {
  id: number | string;
  name: string;
  attn?: string;
  address?: string;
  city?: string;
  phone?: string;
}

export interface FormStatus {
  isShippingSame: boolean;
  isPrinting: boolean;
  error: string;
  successMessage: string;
  fieldErrors: Record<string, string>;
}

export interface DropdownState {
  customers: CustomerRecord[];
  shippingProfiles: ShippingRecord[];
  selectedCustomerId: string;
  selectedShippingId: string;
  customersLoading: boolean;
  customersLoaded: boolean;
  shippingLoading: boolean;
  shippingLoaded: boolean;
  error: string;
}

export const LOGISTIC_FIELDS = [
  { key: 'poNo', label: 'P.O. NO.', placeholder: 'e.g. PO-998' },
  { key: 'shipVia', label: 'SHIP VIA', placeholder: 'e.g. Company Van' },
  { key: 'salesperson', label: 'REP', placeholder: 'e.g. Admin' },
  { key: 'fob', label: 'F.O.B.', placeholder: 'e.g. Destination' },
  { key: 'terms', label: 'TERMS', placeholder: 'e.g. Net 30' },
];

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  status: FormStatus;
  dropdowns: DropdownState;
  balanceDue: number;
  onShippingSameToggle: () => void;
  onCustomerSelect: (value: string) => void;
  onShippingSelect: (value: string) => void;
  onCustomerDropdownOpen: () => void;
  onShippingDropdownOpen: () => void;
  onInputChange: (
    section: ObjectSectionKey,
    field: string,
    value: string | number
  ) => void;
  onItemChange: (
    id: number,
    field: keyof Omit<InvoiceItem, 'id'>,
    value: string | number
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onLedgerChange: (
    field: 'taxRate' | 'shipping' | 'other' | 'previousDue',
    value: number
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  todayPrices: sellingPriceRequestBody[];
}

const SectionHeader: React.FC<{
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, action }) => (
  <div className="flex flex-col gap-3 border-b-2 border-slate-900/90 pb-2 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-amber-50 sm:h-7 sm:w-7">
        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </span>
      <div className="leading-tight min-w-0">
        <h3 className="text-xs font-bold text-slate-900 sm:text-sm truncate">
          {title}
        </h3>
      </div>
    </div>
    {action && <div className="w-full sm:w-auto">{action}</div>}
  </div>
);

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  status,
  dropdowns,
  balanceDue,
  onShippingSameToggle,
  onCustomerSelect,
  onShippingSelect,
  onCustomerDropdownOpen,
  onShippingDropdownOpen,
  onInputChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onLedgerChange,
  onSubmit,
  todayPrices,
}) => {
  const { isShippingSame, isPrinting, error, successMessage, fieldErrors } =
    status;
  const [selectedSellingPrice, setSelectedSellingPrice] = useState('');
  const {
    customers,
    shippingProfiles,
    selectedCustomerId,
    selectedShippingId,
    customersLoading,
    customersLoaded,
    shippingLoading,
    shippingLoaded,
    error: dropdownError,
  } = dropdowns;

  const handleCustomerDropdownOpen = () => {
    if (!customersLoaded && !customersLoading) {
      onCustomerDropdownOpen();
    }
  };

  const handleShippingDropdownOpen = () => {
    if (!shippingLoaded && !shippingLoading) {
      onShippingDropdownOpen();
    }
  };

  const handleCustomerSelect = (value: string) => {
    onCustomerSelect(value === selectedCustomerId ? '' : value);
  };

  const handleShippingSelect = (value: string) => {
    onShippingSelect(value === selectedShippingId ? '' : value);
  };

  const itemsSubtotal = invoiceData.items.reduce(
    (sum, item) =>
      sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  return (
    <div className="min-h-screen w-full bg-[size:22px_22px] flex items-start sm:items-center justify-center pt-16 pb-6 px-3 sm:py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-5xl rounded-xl sm:rounded-2xl bg-surface ring-1 shadow-lg border border-slate-900/10 overflow-hidden">
        <div className="relative bg-slate-900 px-3 py-4 sm:px-6 sm:py-7 md:px-10 text-amber-50">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)',
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="flex h-7 w-7 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/90 text-slate-950 shadow-md">
                <Receipt className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-2xl md:text-3xl font-black tracking-tight truncate">
                  Customer Invoice
                </h1>
              </div>
            </div>

            <div className="w-full sm:w-48 order-3 sm:order-none">
              <label className="mb-1 block text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-teal-300">
                Invoice ID No
              </label>
              <div className="rounded-lg bg-slate-800/80 ring-1 ring-white/10 focus-within:ring-teal-400 transition-shadow">
                <input
                  type="text"
                  name="invoiceNo"
                  value={invoiceData.meta.invoiceNo}
                  onChange={(e) =>
                    onInputChange('meta', 'invoiceNo', e.target.value)
                  }
                  placeholder="ZAM-246"
                  className="w-full bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {dropdownError && (
          <p className="mx-3 mt-4 sm:mx-10 sm:mt-6 text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
            {dropdownError}
          </p>
        )}

        <form
          className="space-y-6 p-3 sm:space-y-9 sm:p-6 md:p-10"
          onSubmit={onSubmit}
        >
          <div className="space-y-3 sm:space-y-4">
            <SectionHeader
              icon={User}
              title="Customer Billing Details"
              action={
                <div
                  className="w-full sm:w-48"
                  onClick={handleCustomerDropdownOpen}
                  onFocus={handleCustomerDropdownOpen}
                >
                  <Dropdown
                    placeholder={
                      customersLoading ? 'Loading...' : 'Select Customer'
                    }
                    options={customers.map((c) => ({
                      label: c.name,
                      value: c.id.toString(),
                    }))}
                    value={selectedCustomerId}
                    onChange={handleCustomerSelect}
                    disabled={customersLoading}
                  />
                </div>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 rounded-xl bg-slate-50/70 p-3 sm:p-4 border border-slate-200/70">
              <div className="sm:col-span-2">
                <WaterInputField
                  type="text"
                  name="name"
                  icon={Building2}
                  label="Company Name"
                  value={invoiceData.billTo.name}
                  onChange={(e) =>
                    onInputChange('billTo', 'name', e.target.value)
                  }
                  placeholder="Client Company Pvt Ltd"
                  error={fieldErrors.name}
                />
              </div>
              <WaterInputField
                type="text"
                icon={User}
                label="Attention / POC"
                value={invoiceData.billTo.attn}
                onChange={(e) =>
                  onInputChange('billTo', 'attn', e.target.value)
                }
                placeholder="Accounts Dept"
              />
              <WaterInputField
                type="text"
                name="phone"
                icon={Phone}
                label="Phone Line"
                value={invoiceData.billTo.phone}
                onChange={(e) =>
                  onInputChange('billTo', 'phone', e.target.value)
                }
                placeholder="e.g. 042-3571122"
                error={fieldErrors.phone}
              />
              <div className="sm:col-span-2">
                <WaterInputField
                  type="text"
                  name="address"
                  icon={MapPin}
                  label="Mailing Address"
                  value={invoiceData.billTo.address}
                  onChange={(e) =>
                    onInputChange('billTo', 'address', e.target.value)
                  }
                  placeholder="456 Gulberg Main Boulevard"
                  error={fieldErrors.address}
                />
              </div>
              <WaterInputField
                type="text"
                name="city"
                icon={MapPin}
                label="City"
                value={invoiceData.billTo.city}
                onChange={(e) =>
                  onInputChange('billTo', 'city', e.target.value)
                }
                placeholder="Lahore"
                error={fieldErrors.city}
              />
              <WaterInputField
                type="email"
                name="email"
                icon={Mail}
                label="Email Desk"
                value={invoiceData.billTo.email}
                onChange={(e) =>
                  onInputChange('billTo', 'email', e.target.value)
                }
                placeholder="billing@clientcompany.com"
                error={fieldErrors.email}
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <SectionHeader
              icon={Truck}
              title="Shipping Destination"
              action={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div
                    className="w-full sm:w-48"
                    onClick={handleShippingDropdownOpen}
                    onFocus={handleShippingDropdownOpen}
                  >
                    <Dropdown
                      placeholder={
                        shippingLoading ? 'Loading...' : 'Select Shipping'
                      }
                      options={shippingProfiles.map((s) => ({
                        label: s.name,
                        value: s.id.toString(),
                      }))}
                      value={selectedShippingId}
                      onChange={handleShippingSelect}
                      disabled={shippingLoading}
                    />
                  </div>
                </div>
              }
            />

            {!isShippingSame && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 rounded-xl bg-slate-50/70 p-3 sm:p-4 border border-slate-200/70 transition-all">
                <div className="sm:col-span-2">
                  <WaterInputField
                    type="text"
                    icon={Building2}
                    label="Warehouse Name"
                    value={invoiceData.shipTo.name}
                    onChange={(e) =>
                      onInputChange('shipTo', 'name', e.target.value)
                    }
                    placeholder="Client Company Warehouse"
                  />
                </div>
                <WaterInputField
                  type="text"
                  icon={User}
                  label="Attention To"
                  value={invoiceData.shipTo.attn}
                  onChange={(e) =>
                    onInputChange('shipTo', 'attn', e.target.value)
                  }
                  placeholder="Store Manager"
                />
                <WaterInputField
                  type="text"
                  icon={Phone}
                  label="Phone Line"
                  value={invoiceData.shipTo.phone}
                  onChange={(e) =>
                    onInputChange('shipTo', 'phone', e.target.value)
                  }
                  placeholder="e.g. 042-3571123"
                />
                <div className="sm:col-span-2">
                  <WaterInputField
                    type="text"
                    icon={MapPin}
                    label="Delivery Address"
                    value={invoiceData.shipTo.address}
                    onChange={(e) =>
                      onInputChange('shipTo', 'address', e.target.value)
                    }
                    placeholder="Plot 12, Sundar Industrial Estate"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <SectionHeader icon={Truck} title="Logistic Operations" />
            <div className="grid grid-cols-1 sm:grid-cols-2 rounded-xl bg-slate-50/70 p-4 sm:p-4 border border-slate-200/70 md:grid-cols-3 gap-3 sm:gap-4">
              {LOGISTIC_FIELDS.map((f) => (
                <WaterInputField
                  type="text"
                  key={f.key}
                  label={f.label}
                  value={
                    invoiceData.logisticInfo[
                      f.key as keyof typeof invoiceData.logisticInfo
                    ]
                  }
                  onChange={(e) =>
                    onInputChange('logisticInfo', f.key, e.target.value)
                  }
                  placeholder={f.placeholder}
                />
              ))}
              <WaterInputField
                type="date"
                icon={Calendar}
                label="DISPATCH DATE"
                value={invoiceData.logisticInfo.shipDate}
                onChange={(e) =>
                  onInputChange('logisticInfo', 'shipDate', e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <SectionHeader
              icon={Receipt}
              title="Line Item Specifications"
              action={
                <button
                  type="button"
                  onClick={onAddItem}
                  className="flex items-center justify-center gap-1 text-[11px] font-bold bg-teal-600 text-white rounded-lg px-3 py-2 sm:py-1.5 shadow-sm hover:bg-teal-700 active:bg-teal-800 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Item Row
                </button>
              }
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {/* Desktop Header */}
              <div
                className="
                hidden lg:grid
                grid-cols-[60px_1.4fr_170px_90px_170px_120px_60px]
                gap-3
                bg-slate-900
                px-4
                py-3
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-white
              "
              >
                <span>ID</span>
                <span>Description</span>
                <span>Bottle Type</span>
                <span>Qty</span>
                <span>Selling Price</span>
                <span className="text-right">Amount</span>
                <span className="text-center">Action</span>
              </div>

              <div className="max-h-[450px] divide-y divide-slate-100 overflow-y-auto">
                {invoiceData.items.map((item, idx) => {
                  const lineTotal =
                    (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);

                  return (
                    <div
                      key={item.id}
                      className={`
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-[60px_1.4fr_170px_90px_170px_120px_60px]
              gap-3
              px-3
              py-4
              sm:px-4
              ${idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}
            `}
                    >
                      {/* ID */}
                      <WaterInputField
                        type="text"
                        label="ID"
                        value={item.no}
                        onChange={(e) =>
                          onItemChange(item.id, 'no', e.target.value)
                        }
                      />

                      {/* Description */}
                      <WaterInputField
                        type="text"
                        label="Description"
                        value={item.description}
                        onChange={(e) =>
                          onItemChange(item.id, 'description', e.target.value)
                        }
                        placeholder="500ml Premium Bottle"
                      />

                      {/* Bottle Type */}
                      <Dropdown
                        label="Bottle Type"
                        options={waterTypes}
                        value={item.bottleType}
                        onChange={(value) =>
                          onItemChange(item.id, 'bottleType', value)
                        }
                      />

                      {/* Qty */}
                      <WaterInputField
                        type="number"
                        label="Qty"
                        value={String(item.qty)}
                        onChange={(e) =>
                          onItemChange(item.id, 'qty', e.target.value)
                        }
                      />

                      {/* Selling Price */}
                      <Dropdown
                        label="Selling Price"
                        placeholder="Select Price"
                        options={todayPrices.map((s) => ({
                          label: `Rs ${s.sellingPrice}`,
                          value: String(s.sellingPrice),
                        }))}
                        value={String(item.unitPrice)}
                        onChange={(value) =>
                          onItemChange(item.id, 'unitPrice', Number(value))
                        }
                      />

                      {/* Amount */}
                      {/* Amount */}
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-slate-700">
                          Amount
                        </label>

                        <div
                          className="
                          flex
                          h-[42px]
                          items-center
                          rounded-xl
                          border
                          border-slate-300
                          bg-slate-50
                          px-4
                          text-sm
                          font-bold
                          text-slate-900
                          whitespace-nowrap
                        "
                        >
                          Rs {lineTotal.toFixed(2)}
                        </div>
                      </div>
                      {/* Delete */}
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-slate-700 opacity-0">
                          Action
                        </label>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(Number(item.id))}
                          className="
                        flex
                        h-[42px]
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-rose-200
                        bg-rose-50
                        text-rose-600
                        transition-all
                        hover:bg-rose-100
                        active:scale-95
                      "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Items Subtotal
                </span>

                <span className="font-mono text-sm font-bold text-slate-900">
                  Rs {itemsSubtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <SectionHeader icon={Percent} title="Ledger Adjustments" />

            <div className="rounded-xl border border-slate-200 bg-white p-4 ">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 ">
                <WaterInputField
                  marginBottom="mb-0"
                  type="number"
                  icon={Percent}
                  label="Tax (%)"
                  value={invoiceData.taxRate.toString()}
                  onChange={(e) =>
                    onLedgerChange('taxRate', Number(e.target.value) || 0)
                  }
                />

                <WaterInputField
                  marginBottom="mb-0"
                  type="number"
                  customicon={RsIcon}
                  label="Shipping (Rs)"
                  value={invoiceData.shipping.toString()}
                  onChange={(e) =>
                    onLedgerChange('shipping', Number(e.target.value) || 0)
                  }
                />

                <WaterInputField
                  marginBottom="mb-0"
                  type="number"
                  customicon={RsIcon}
                  label="Misc (Rs)"
                  value={invoiceData.other.toString()}
                  onChange={(e) =>
                    onLedgerChange('other', Number(e.target.value) || 0)
                  }
                />

                <WaterInputField
                  marginBottom="mb-0"
                  type="number"
                  customicon={RsIcon}
                  label="Previous Due"
                  value={invoiceData.previousDue.toString()}
                  onChange={(e) =>
                    onLedgerChange('previousDue', Number(e.target.value) || 0)
                  }
                />

                <WaterInputField
                  marginBottom="mb-0"
                  type="number"
                  customicon={RsIcon}
                  label="Paid Amount"
                  value={invoiceData.payment.paidAmount.toString()}
                  onChange={(e) =>
                    onInputChange(
                      'payment',
                      'paidAmount',
                      Number(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div className="mt-5 flex justify-end">
                <div className="min-w-[220px] rounded-xl bg-teal-600 px-5 py-4 text-white shadow">
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    Net Balance Due
                  </p>

                  <p className="mt-1 font-mono text-2xl font-bold">
                    Rs {balanceDue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              {successMessage}
            </p>
          )}

          <Button
            label={
              isPrinting
                ? 'Compiling Invoice Template...'
                : 'Save & Download Invoice'
            }
            type="submit"
            loading={isPrinting}
            className="w-full mt-2"
          />
        </form>
      </main>
    </div>
  );
};

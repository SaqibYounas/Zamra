'use client';

import React from 'react';
import {
  Plus,
  Trash2,
  CheckSquare,
  Square,
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

export interface CustomerRecord {
  id: number | string;
  name: string;
  attn?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
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
}

const SectionHeader: React.FC<{
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, eyebrow, title, action }) => (
  <div className="flex items-end justify-between gap-3 border-b-2 border-slate-900/90 pb-2">
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-amber-50">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="leading-tight">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
          {eyebrow}
        </p>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
    </div>
    {action}
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
}) => {
  const { isShippingSame, isPrinting, error, successMessage, fieldErrors } =
    status;
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
    <div className="min-h-screen bg-[size:22px_22px] flex items-center lg:mt-0 md:mt-4 justify-center py-8 px-4 sm:py-10 sm:px-6 lg:px-8 ">
      <main className="w-full max-w-5xl rounded-2xl bg-surface ring-1 shadow-lg border border-slate-900/10 overflow-hidden">
        <div className="relative bg-slate-900 px-6 py-7 sm:px-10 text-amber-50">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)',
            }}
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/90 text-slate-950 shadow-md">
                <Receipt className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-300">
                  Tax Invoice
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Customer Invoice
                </h1>
              </div>
            </div>

            <div className="w-full sm:w-64">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">
                Invoice ID No
              </label>
              <div className="rounded-lg bg-slate-800/80 ring-1 ring-white/10 focus-within:ring-teal-400 transition-shadow">
                <WaterInputField
                  type="text"
                  name="invoiceNo"
                  value={invoiceData.meta.invoiceNo}
                  onChange={(e) =>
                    onInputChange('meta', 'invoiceNo', e.target.value)
                  }
                  placeholder="e.g. ZAM-246"
                  error={fieldErrors.invoiceNo}
                  label={''}
                />
              </div>
            </div>
          </div>
        </div>

        {dropdownError && (
          <p className="mx-6 mt-6 sm:mx-10 text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
            {dropdownError}
          </p>
        )}

        <form className="space-y-9 p-6 sm:p-10" onSubmit={onSubmit}>
          <div className="space-y-4">
            <SectionHeader
              icon={User}
              eyebrow="Billed To"
              title="Customer Billing Details"
              action={
                <div
                  className="w-40 sm:w-48"
                  onClick={handleCustomerDropdownOpen}
                  onFocus={handleCustomerDropdownOpen}
                >
                  <Dropdown
                    placeholder={
                      customersLoading ? 'Loading...' : 'Load Customer'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-slate-50/70 p-4 border border-slate-200/70">
              <div className="md:col-span-2">
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
              <div className="md:col-span-2">
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

          {/* SHIPPING */}
          <div className="space-y-4">
            <SectionHeader
              icon={Truck}
              eyebrow="Ship To"
              title="Shipping Destination"
              action={
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onShippingSameToggle}
                    className="flex items-center gap-1.5 text-[11px] text-teal-700 font-bold tracking-tight whitespace-nowrap rounded-lg px-2 py-1 hover:bg-teal-50 transition-colors"
                  >
                    {isShippingSame ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}{' '}
                    Same as Billing
                  </button>
                  <div
                    className="w-40 sm:w-48"
                    onClick={handleShippingDropdownOpen}
                    onFocus={handleShippingDropdownOpen}
                  >
                    <Dropdown
                      placeholder={
                        shippingLoading ? 'Loading...' : 'Load Shipping'
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-slate-50/70 p-4 border border-slate-200/70 transition-all">
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
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

          {/* LOGISTICS */}
          <div className="space-y-4">
            <SectionHeader
              icon={Truck}
              eyebrow="Dispatch"
              title="Logistic Operations"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

          {/* LINE ITEMS */}
          <div className="space-y-4">
            <SectionHeader
              icon={Receipt}
              eyebrow="Manifest"
              title="Line Item Specifications"
              action={
                <button
                  type="button"
                  onClick={onAddItem}
                  className="flex items-center gap-1 text-[11px] font-bold bg-teal-600 text-white rounded-lg px-3 py-1.5 shadow-sm hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 " /> Add Item Row
                </button>
              }
            />

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-[10%_38%_12%_16%_16%_8%] gap-3 bg-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-50">
                <span>ID</span>
                <span>Description</span>
                <span>Qty</span>
                <span>Rate (Rs)</span>
                <span className="text-right">Amount (Rs)</span>
                <span className="text-center">—</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto bg-white">
                {invoiceData.items.map((item, idx) => {
                  const lineTotal =
                    (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-1 md:grid-cols-[10%_38%_12%_16%_16%_8%] gap-3 px-4 py-3 items-end ${
                        idx % 2 === 1 ? 'bg-slate-50/60' : ''
                      }`}
                    >
                      <WaterInputField
                        type="text"
                        label="ID"
                        value={item.no}
                        onChange={(e) =>
                          onItemChange(item.id, 'no', e.target.value)
                        }
                      />
                      <WaterInputField
                        type="text"
                        label="Description"
                        value={item.description}
                        onChange={(e) =>
                          onItemChange(item.id, 'description', e.target.value)
                        }
                        placeholder="500ml Premium Bottle (Box of 24)"
                      />
                      <WaterInputField
                        type="number"
                        label="QTY"
                        value={item.qty.toString()}
                        onChange={(e) =>
                          onItemChange(item.id, 'qty', e.target.value)
                        }
                      />
                      <WaterInputField
                        type="number"
                        customicon={RsIcon}
                        label="Rate (Rs)"
                        value={item.unitPrice.toString()}
                        onChange={(e) =>
                          onItemChange(item.id, 'unitPrice', e.target.value)
                        }
                      />
                      <div className="flex flex-col justify-center h-full pb-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 md:hidden">
                          Amount
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-800 md:text-right">
                          {lineTotal.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2.5 mb-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors w-full md:w-auto flex justify-center items-center cursor-pointer"
                        aria-label="Remove line item "
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end bg-slate-50 px-4 py-2 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Items Subtotal:&nbsp;
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  Rs {itemsSubtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* LEDGER */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
            <div className="space-y-4">
              <SectionHeader
                icon={Percent}
                eyebrow="Adjustments"
                title="Ledger Adjustments"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <WaterInputField
                  type="number"
                  icon={Percent}
                  label="Tax Rate (%)"
                  value={invoiceData.taxRate.toString()}
                  onChange={(e) =>
                    onLedgerChange('taxRate', Number(e.target.value))
                  }
                />
                <WaterInputField
                  type="number"
                  customicon={RsIcon}
                  label="Shipping Charges (Rs)"
                  value={invoiceData.shipping.toString()}
                  onChange={(e) =>
                    onLedgerChange('shipping', Number(e.target.value))
                  }
                />
                <WaterInputField
                  type="number"
                  customicon={RsIcon}
                  label="Misc Charges (Rs)"
                  value={invoiceData.other.toString()}
                  onChange={(e) =>
                    onLedgerChange('other', Number(e.target.value))
                  }
                />
                <WaterInputField
                  type="number"
                  customicon={RsIcon}
                  label="Previous Due Arrears (Rs)"
                  value={invoiceData.previousDue.toString()}
                  onChange={(e) =>
                    onLedgerChange('previousDue', Number(e.target.value))
                  }
                />
                <WaterInputField
                  type="number"
                  customicon={RsIcon}
                  label="Amount Paid By Client (Rs)"
                  value={invoiceData.payment.paidAmount.toString()}
                  onChange={(e) =>
                    onInputChange('payment', 'paidAmount', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex justify-center lg:justify-end pt-2">
              <div className="-rotate-2 rounded-xl border-[3px] border-dashed border-teal-700/70 bg-teal-50/60 px-6 py-4 text-center shadow-sm">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
                  Net Balance Due
                </span>
                <span className="mt-1 block font-mono text-2xl font-black text-teal-800">
                  Rs {balanceDue.toFixed(2)}
                </span>
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

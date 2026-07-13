'use client';

import React from 'react';
import {
  Plus,
  Trash2,
  FileText,
  CheckSquare,
  Square,
  Calendar,
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
  loading: boolean;
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

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  status,
  dropdowns,
  balanceDue,
  onShippingSameToggle,
  onCustomerSelect,
  onShippingSelect,
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
    loading: loadingDropdowns,
    error: dropdownError,
  } = dropdowns;

  return (
    <div className="min-h-screen bg-amber-50  flex items-center lg:mt-0 md:mt-4 justify-center py-8 px-4 sm:py-10 sm:px-6 lg:px-8 md:ml-16">
      <main className="w-full max-w-5xl rounded-2xl bg-surface p-6 sm:p-10 shadow-lg border border-slate-200/50">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900">
            Customer Invoice
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Fill standard operations and load real-time parameters to generate
            compiled templates.
          </p>
        </div>

        {dropdownError && (
          <p className="mb-4 text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100">
            {dropdownError}
          </p>
        )}

        <form className="space-y-8" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <WaterInputField
              type="text"
              name="invoiceNo"
              label="Invoice ID No"
              value={invoiceData.meta.invoiceNo}
              onChange={(e) =>
                onInputChange('meta', 'invoiceNo', e.target.value)
              }
              placeholder="e.g. ZAM-246"
              error={fieldErrors.invoiceNo}
            />
            <WaterInputField
              type="date"
              icon={Calendar}
              label="Invoice Date"
              value={invoiceData.meta.date}
              onChange={(e) => onInputChange('meta', 'date', e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1 gap-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Customer Billing Parametegitrs
              </h3>
              <div className="max-w-[180px] w-full">
                <Dropdown
                  placeholder={
                    loadingDropdowns ? 'Loading...' : 'Select Customer'
                  }
                  options={customers.map((c) => ({
                    label: c.name,
                    value: c.id.toString(),
                  }))}
                  value={selectedCustomerId}
                  onChange={onCustomerSelect}
                  disabled={loadingDropdowns}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <WaterInputField
                  type="text"
                  name="name"
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

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1 gap-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Shipping Destination Profile
              </h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onShippingSameToggle}
                  className="flex items-center gap-1.5 text-[11px] text-teal-600 font-bold tracking-tight whitespace-nowrap"
                >
                  {isShippingSame ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}{' '}
                  Same as Billing
                </button>

                <Dropdown
                  placeholder={
                    loadingDropdowns ? 'Loading...' : 'Select Shipping'
                  }
                  options={shippingProfiles.map((s) => ({
                    label: s.name,
                    value: s.id.toString(),
                  }))}
                  value={selectedShippingId}
                  onChange={onShippingSelect}
                  disabled={loadingDropdowns}
                />
              </div>
            </div>

            {!isShippingSame && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition-all">
                <div className="md:col-span-2">
                  <WaterInputField
                    type="text"
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
                  label="Attention To"
                  value={invoiceData.shipTo.attn}
                  onChange={(e) =>
                    onInputChange('shipTo', 'attn', e.target.value)
                  }
                  placeholder="Store Manager"
                />
                <WaterInputField
                  type="text"
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

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1">
              Logistic Operations Registry
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
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

          {/* DYNAMIC ITEM SPECIFICATIONS LIST */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Line Item Specifications
              </h3>
              <button
                type="button"
                onClick={onAddItem}
                className="flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200/50 rounded-xl px-3 py-1.5 hover:bg-teal-100 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Item Row
              </button>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {invoiceData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100 items-end shadow-sm"
                >
                  <div className="w-full md:w-[12%]">
                    <WaterInputField
                      type="text"
                      label="ID"
                      value={item.no}
                      onChange={(e) =>
                        onItemChange(item.id, 'no', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <WaterInputField
                      type="text"
                      label="Description"
                      value={item.description}
                      onChange={(e) =>
                        onItemChange(item.id, 'description', e.target.value)
                      }
                      placeholder="500ml Premium Bottle (Box of 24)"
                    />
                  </div>
                  <div className="w-full md:w-[15%]">
                    <WaterInputField
                      type="number"
                      label="QTY"
                      value={item.qty.toString()}
                      onChange={(e) =>
                        onItemChange(item.id, 'qty', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full md:w-[20%]">
                    <WaterInputField
                      type="number"
                      customicon={RsIcon}
                      label="Rate (Rs)"
                      value={item.unitPrice.toString()}
                      onChange={(e) =>
                        onItemChange(item.id, 'unitPrice', e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2.5 mb-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors w-full md:w-auto flex justify-center items-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LEDGER ADJUSTMENTS TOTALS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1">
              Ledger Adjustments
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <WaterInputField
                type="number"
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

              <div className="bg-surface border border-slate-200 rounded-xl p-3 flex flex-col justify-center items-end text-right shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Net Balance Due
                </span>
                <span className="text-base font-black text-teal-700 font-mono">
                  Rs {balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
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
            className="w-full mt-6"
          />
        </form>
      </main>
    </div>
  );
};

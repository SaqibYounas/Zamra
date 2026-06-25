'use client';
import React from 'react';
import { Plus, Trash2, FileText, CheckSquare, Square } from 'lucide-react';
import FormInput from '../../../src/components/inputFields/FormInput';
import Button from '../../../src/components/button/Button';
import { InvoiceData, ObjectSectionKey, InvoiceItem } from '../../types/types';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  isShippingSame: boolean;
  isPrinting: boolean;
  setIsShippingSame: (val: boolean) => void;
  handleInputChange: (
    section: ObjectSectionKey,
    field: string,
    value: string | number
  ) => void;
  handleItemChange: (
    id: number,
    field: keyof Omit<InvoiceItem, 'id'>,
    value: string | number
  ) => void;
  addItem: () => void;
  removeItem: (id: number) => void;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  handlePrint: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  isShippingSame,
  isPrinting,
  setIsShippingSame,
  handleInputChange,
  handleItemChange,
  addItem,
  removeItem,
  setInvoiceData,
  handlePrint,
}) => {
  return (
    <div className="w-full xl:w-[45%] bg-white border-r border-slate-200 shadow-sm flex flex-col p-5 space-y-6 max-h-screen xl:overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <FileText className="w-5 h-5 text-teal-600" />
        <div>
          <h2 className="text-base font-black text-slate-800 tracking-tight">
            Invoice Control Dock
          </h2>
          <p className="text-[11px] text-slate-400">
            Fill billing parameters to compile standard invoice templates
          </p>
        </div>
      </div>

      {/* META INFO */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
        <FormInput
          label="Invoice ID No"
          value={invoiceData.meta.invoiceNo}
          onChange={(v) => handleInputChange('meta', 'invoiceNo', v)}
        />
        <FormInput
          label="Invoice Date"
          type="date"
          value={invoiceData.meta.date}
          onChange={(v) => handleInputChange('meta', 'date', v)}
        />
      </div>

      {/* BILL TO */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1 flex justify-between items-center">
          <span>Customer Billing Profile</span>
          <span className="text-[9px] text-teal-600 font-black">Bill To</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <FormInput
              label="Company Name"
              value={invoiceData.billTo.name}
              onChange={(v) => handleInputChange('billTo', 'name', v)}
            />
          </div>
          <FormInput
            label="Attention/POC"
            value={invoiceData.billTo.attn}
            onChange={(v) => handleInputChange('billTo', 'attn', v)}
          />
          <FormInput
            label="Phone Line"
            value={invoiceData.billTo.phone}
            onChange={(v) => handleInputChange('billTo', 'phone', v)}
          />
          <div className="col-span-2">
            <FormInput
              label="Mailing Address"
              value={invoiceData.billTo.address}
              onChange={(v) => handleInputChange('billTo', 'address', v)}
            />
          </div>
          <FormInput
            label="City"
            value={invoiceData.billTo.city}
            onChange={(v) => handleInputChange('billTo', 'city', v)}
          />
          <FormInput
            label="Email Desk"
            type="email"
            value={invoiceData.billTo.email}
            onChange={(v) => handleInputChange('billTo', 'email', v)}
          />
        </div>
      </div>

      {/* SHIP TO PROFILE TOGGLE */}
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-1">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Shipping Destination Profile
          </h3>
          <button
            onClick={() => setIsShippingSame(!isShippingSame)}
            className="flex items-center gap-1.5 text-[10px] text-teal-600 font-bold hover:text-teal-700 transition-colors"
          >
            {isShippingSame ? (
              <CheckSquare className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            Same as Billing
          </button>
        </div>

        {!isShippingSame && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <FormInput
                label="Warehouse Name"
                value={invoiceData.shipTo.name}
                onChange={(v) => handleInputChange('shipTo', 'name', v)}
              />
            </div>
            <FormInput
              label="Attention To"
              value={invoiceData.shipTo.attn}
              onChange={(v) => handleInputChange('shipTo', 'attn', v)}
            />
            <FormInput
              label="Phone Line"
              value={invoiceData.shipTo.phone}
              onChange={(v) => handleInputChange('shipTo', 'phone', v)}
            />
            <div className="col-span-2">
              <FormInput
                label="Delivery Address"
                value={invoiceData.shipTo.address}
                onChange={(v) => handleInputChange('shipTo', 'address', v)}
              />
            </div>
          </div>
        )}
      </div>

      {/* LOGISTICS */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1">
          Logistic Operations Registry
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <FormInput
            label="P.O. NO."
            value={invoiceData.logisticInfo.poNo}
            onChange={(v) => handleInputChange('logisticInfo', 'poNo', v)}
          />
          <FormInput
            label="DISPATCH DATE"
            type="date"
            value={invoiceData.logisticInfo.shipDate}
            onChange={(v) => handleInputChange('logisticInfo', 'shipDate', v)}
          />
          <FormInput
            label="SHIP VIA"
            value={invoiceData.logisticInfo.shipVia}
            onChange={(v) => handleInputChange('logisticInfo', 'shipVia', v)}
          />
          <FormInput
            label="REP"
            value={invoiceData.logisticInfo.salesperson}
            onChange={(v) =>
              handleInputChange('logisticInfo', 'salesperson', v)
            }
          />
          <FormInput
            label="F.O.B."
            value={invoiceData.logisticInfo.fob}
            onChange={(v) => handleInputChange('logisticInfo', 'fob', v)}
          />
          <FormInput
            label="TERMS"
            value={invoiceData.logisticInfo.terms}
            onChange={(v) => handleInputChange('logisticInfo', 'terms', v)}
          />
        </div>
      </div>

      {/* LINE ITEMS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-1">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Line Item Specifications
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/50 rounded-lg px-2.5 py-1 hover:bg-teal-100 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Item
          </button>
        </div>

        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {invoiceData.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 items-end"
            >
              <div className="w-[15%]">
                <FormInput
                  label="ID"
                  value={item.no}
                  onChange={(v) => handleItemChange(item.id, 'no', v)}
                />
              </div>
              <div className="w-[45%]">
                <FormInput
                  label="Description"
                  value={item.description}
                  onChange={(v) => handleItemChange(item.id, 'description', v)}
                />
              </div>
              <div className="w-[15%]">
                <FormInput
                  label="QTY"
                  type="number"
                  value={item.qty.toString()}
                  onChange={(v) => handleItemChange(item.id, 'qty', Number(v))}
                />
              </div>
              <div className="w-[25%]">
                <FormInput
                  label="Rate (Rs)"
                  type="number"
                  value={item.unitPrice.toString()}
                  onChange={(v) =>
                    handleItemChange(item.id, 'unitPrice', Number(v))
                  }
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 mb-0.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* OVERHEADS */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1">
          Ledger Adjustments
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <FormInput
            label="Tax Rate (%)"
            type="number"
            value={invoiceData.taxRate.toString()}
            onChange={(v) =>
              setInvoiceData((p) => ({ ...p, taxRate: Number(v) }))
            }
          />
          <FormInput
            label="Shipping (Rs)"
            type="number"
            value={invoiceData.shipping.toString()}
            onChange={(v) =>
              setInvoiceData((p) => ({ ...p, shipping: Number(v) }))
            }
          />
          <FormInput
            label="Misc Charges"
            type="number"
            value={invoiceData.other.toString()}
            onChange={(v) =>
              setInvoiceData((p) => ({ ...p, other: Number(v) }))
            }
          />
          <FormInput
            label="Previous Due"
            type="number"
            value={invoiceData.previousDue.toString()}
            onChange={(v) =>
              setInvoiceData((p) => ({ ...p, previousDue: Number(v) }))
            }
          />
          <FormInput
            label="Amount Paid"
            type="number"
            value={invoiceData.payment.paidAmount.toString()}
            onChange={(v) =>
              handleInputChange('payment', 'paidAmount', Number(v))
            }
          />
        </div>
      </div>

      {/* SUBMIT */}
      <div className="pt-4 border-t border-slate-100">
        <Button
          label={
            isPrinting ? 'Compiling PDF Engine...' : 'Download Template Invoice'
          }
          onClick={handlePrint}
          loading={isPrinting}
          className="w-full py-3 text-xs font-bold uppercase"
        />
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, FileText, CheckSquare, Square } from 'lucide-react';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import FormInput from '../../src/components/inputFields/FormInput';
import Button from '../../src/components/button/Button';
import { InvoiceData, ObjectSectionKey, InvoiceItem } from '../types/types';

interface PdfEngine {
  jsPDF: new (options?: Record<string, unknown>) => unknown;
  html2canvas: (
    element: HTMLElement,
    options?: Record<string, unknown>
  ) => Promise<HTMLCanvasElement>;
}

const todayISO = () => new Date().toISOString().split('T')[0];

// 🌟 PRE-FILLED TESTING DATA MODEL
const initialInvoiceData: InvoiceData = {
  companyInfo: {
    name: 'Zamra Water Planet',
    address: '123 Main Street, Industrial Area',
    city: 'Lahore, Pakistan',
    phone: '+92 321 4567890',
    email: 'hello@zamrawater.com',
    poc: 'Sufyan Malik',
  },
  meta: {
    date: todayISO(),
    invoiceNo: 'ZAM-246', // Default testing entry
  },
  billTo: {
    attn: 'Accounts Dept',
    name: 'Client Company Pvt Ltd',
    address: '456 Gulberg Main Boulevard',
    city: 'Lahore',
    phone: '042-3571122',
    email: 'billing@clientcompany.com',
  },
  shipTo: {
    attn: 'Store Manager',
    name: 'Client Company Warehouse',
    address: 'Plot 12, Sundar Industrial Estate',
    city: 'Lahore',
    phone: '042-3571123',
  },
  logisticInfo: {
    poNo: 'PO-998',
    shipDate: todayISO(),
    shipVia: 'Company Van',
    salesperson: 'Admin',
    fob: 'Destination',
    terms: 'Net 30',
  },
  items: [
    {
      id: 1,
      no: '1',
      description: '500ml Premium Bottle (Box of 24)',
      qty: 10,
      unitPrice: 50.0,
    },
    {
      id: 2,
      no: '2',
      description: '1.5L Premium Bottle (Box of 12)',
      qty: 5,
      unitPrice: 80.0,
    },
    {
      id: 3,
      no: '3',
      description: '19L Corporate Water Gallon',
      qty: 2,
      unitPrice: 250.0,
    },
  ],
  previousDue: 1500,
  payment: { paidAmount: 1000 },
  taxRate: 3.8,
  shipping: 120,
  other: 50,
};

const LOGISTIC_FIELDS = [
  { key: 'poNo', label: 'P.O. NO.', placeholder: 'e.g. PO-998' },
  { key: 'shipVia', label: 'SHIP VIA', placeholder: 'e.g. Company Van' },
  { key: 'salesperson', label: 'REP', placeholder: 'e.g. Admin' },
  { key: 'fob', label: 'F.O.B.', placeholder: 'e.g. Destination' },
  { key: 'terms', label: 'TERMS', placeholder: 'e.g. Net 30' },
];

export default function InvoiceFormDashboard() {
  const [isShippingSame, setIsShippingSame] = useState(false);
  const [invoiceData, setInvoiceData] =
    useState<InvoiceData>(initialInvoiceData);
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfEngine, setPdfEngine] = useState<PdfEngine | null>(null);

  // State for headless UI input field errors tracking
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    Promise.all([import('jspdf'), import('html2canvas-pro')])
      .then(([jsPDFModule, html2canvasModule]) => {
        setPdfEngine({
          jsPDF: jsPDFModule.jsPDF ?? jsPDFModule.default,
          html2canvas: html2canvasModule.default,
        });
      })
      .catch((err) => console.error('PDF engine failed to load:', err));
  }, []);

  useEffect(() => {
    if (!isShippingSame) return;
    setInvoiceData((prev) => ({
      ...prev,
      shipTo: {
        attn: prev.billTo.attn,
        name: prev.billTo.name,
        address: prev.billTo.address,
        city: prev.billTo.city,
        phone: prev.billTo.phone,
      },
    }));
  }, [isShippingSame, invoiceData.billTo]);

  const handleInputChange = useCallback(
    (section: ObjectSectionKey, field: string, value: string | number) => {
      setInvoiceData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    },
    []
  );

  const handleItemChange = useCallback(
    (
      id: number,
      field: keyof Omit<InvoiceItem, 'id'>,
      value: string | number
    ) => {
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const addItem = useCallback(() => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          no: (prev.items.length + 1).toString(),
          description: '',
          qty: 1,
          unitPrice: 0,
        },
      ],
    }));
  }, []);

  const removeItem = useCallback((id: number) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.qty * item.unitPrice,
    0
  );
  const taxAmount = (subtotal * invoiceData.taxRate) / 100;
  const totalAmount =
    subtotal +
    taxAmount +
    Number(invoiceData.shipping) +
    Number(invoiceData.other) +
    Number(invoiceData.previousDue);
  const balanceDue = Math.max(
    0,
    totalAmount - Number(invoiceData.payment.paidAmount)
  );

  const handleValidationAndPrint = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const localErrors: Record<string, string> = {};

    // Trigger explicit rules verification
    if (!invoiceData.meta.invoiceNo)
      localErrors.invoiceNo = 'Invoice ID Tracking Number is required.';
    if (!invoiceData.billTo.name)
      localErrors.name = 'Company Name field is required.';
    if (!invoiceData.billTo.phone)
      localErrors.phone = 'Phone Line is required.';
    if (!invoiceData.billTo.address)
      localErrors.address = 'Mailing Address is required.';
    if (!invoiceData.billTo.city)
      localErrors.city = 'City context parameter is required.';
    if (!invoiceData.billTo.email)
      localErrors.email = 'Email Desk address is required.';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setError('Please fix the empty parameters marked below.');

      // 🌟 FOCUS ENGINE LIFECYCLE: Automatically focus the first failing selector node
      const firstEmptyFieldKey = Object.keys(localErrors)[0];

      setTimeout(() => {
        const inputElement = document.querySelector(
          `input[name="${firstEmptyFieldKey}"]`
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputElement.focus();
        }
      }, 100);

      return;
    }

    if (invoiceData.items.length === 0 || !invoiceData.items[0].description) {
      setError(
        'Please append at least one valid row item description parameter.'
      );
      return;
    }

    if (!pdfEngine) {
      setError('PDF compile engine is initializing, retry in a moment.');
      return;
    }

    setFieldErrors({});
    setSuccessMessage('Invoice parameters validated. Downloading document...');
    setIsPrinting(true);

    const source = document.getElementById('invoice-doc');
    if (!source) return;

    const clone = source.cloneNode(true) as HTMLElement;
    clone.classList.remove('hidden');
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '800px';
    clone.style.height = '1120px';
    clone.style.background = '#ffffff';

    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.left = '-9999px';
    host.appendChild(clone);
    document.body.appendChild(host);

    try {
      const canvas = await pdfEngine.html2canvas(clone, {
        scale: 2.2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const pdf = new pdfEngine.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      }) as unknown;
      const imgWidth = pdf.internal.pageSize.getWidth() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        10,
        10,
        imgWidth,
        imgHeight
      );
      pdf.save(`Invoice_${invoiceData.meta.invoiceNo}.pdf`);
    } catch (e) {
      console.error(e);
      setError('Failed to render standard PDF template binaries.');
    } finally {
      document.body.removeChild(host);
      setIsPrinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8 px-4 sm:py-10 sm:px-6 lg:px-8 md:ml-16">
      <main className="w-full max-w-5xl rounded-3xl bg-white p-6 sm:p-10 shadow-xl shadow-[rgba(15,23,42,0.08)]">
        {/* BRAND */}
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <p className="text-teal-600 uppercase tracking-[0.4em] text-[11px] font-black">
              POS Billing Terminal
            </p>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Compile Customer Invoice
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Fill standard operations and load real-time parameters to generate
            compiled templates.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-2 sm:p-4">
          <form className="space-y-8" onSubmit={handleValidationAndPrint}>
            {/* INVOICE ID & DATE PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/50">
              <FormInput
                name="invoiceNo"
                label="Invoice ID No"
                value={invoiceData.meta.invoiceNo}
                onChange={(v) => handleInputChange('meta', 'invoiceNo', v)}
                placeholder="e.g. ZAM-246"
                error={fieldErrors.invoiceNo}
              />
              <FormInput
                label="Invoice Date"
                type="date"
                value={invoiceData.meta.date}
                onChange={(v) => handleInputChange('meta', 'date', v)}
              />
            </div>

            {/* BILL TO CONTROLS */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                Customer Billing Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <FormInput
                    name="name"
                    label="Company Name"
                    value={invoiceData.billTo.name}
                    onChange={(v) => handleInputChange('billTo', 'name', v)}
                    placeholder="Client Company Pvt Ltd"
                    error={fieldErrors.name}
                  />
                </div>
                <FormInput
                  label="Attention / POC"
                  value={invoiceData.billTo.attn}
                  onChange={(v) => handleInputChange('billTo', 'attn', v)}
                  placeholder="Accounts Dept"
                />
                <FormInput
                  name="phone"
                  label="Phone Line"
                  value={invoiceData.billTo.phone}
                  onChange={(v) => handleInputChange('billTo', 'phone', v)}
                  placeholder="e.g. 042-3571122"
                  error={fieldErrors.phone}
                />
                <div className="md:col-span-2">
                  <FormInput
                    name="address"
                    label="Mailing Address"
                    value={invoiceData.billTo.address}
                    onChange={(v) => handleInputChange('billTo', 'address', v)}
                    placeholder="456 Gulberg Main Boulevard"
                    error={fieldErrors.address}
                  />
                </div>
                <FormInput
                  name="city"
                  label="City"
                  value={invoiceData.billTo.city}
                  onChange={(v) => handleInputChange('billTo', 'city', v)}
                  placeholder="Lahore"
                  error={fieldErrors.city}
                />
                <FormInput
                  name="email"
                  label="Email Desk"
                  type="email"
                  value={invoiceData.billTo.email}
                  onChange={(v) => handleInputChange('billTo', 'email', v)}
                  placeholder="billing@clientcompany.com"
                  error={fieldErrors.email}
                />
              </div>
            </div>

            {/* SHIP TO PROFILE TOGGLE CONTROLS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Shipping Destination Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsShippingSame(!isShippingSame)}
                  className="flex items-center gap-1.5 text-[11px] text-teal-600 font-bold tracking-tight"
                >
                  {isShippingSame ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}{' '}
                  Same as Billing
                </button>
              </div>

              {!isShippingSame && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition-all">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Warehouse Name"
                      value={invoiceData.shipTo.name}
                      onChange={(v) => handleInputChange('shipTo', 'name', v)}
                      placeholder="Client Company Warehouse"
                    />
                  </div>
                  <FormInput
                    label="Attention To"
                    value={invoiceData.shipTo.attn}
                    onChange={(v) => handleInputChange('shipTo', 'attn', v)}
                    placeholder="Store Manager"
                  />
                  <FormInput
                    label="Phone Line"
                    value={invoiceData.shipTo.phone}
                    onChange={(v) => handleInputChange('shipTo', 'phone', v)}
                    placeholder="e.g. 042-3571123"
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Delivery Address"
                      value={invoiceData.shipTo.address}
                      onChange={(v) =>
                        handleInputChange('shipTo', 'address', v)
                      }
                      placeholder="Plot 12, Sundar Industrial Estate"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LOGISTICS PANEL */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                Logistic Operations Registry
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {LOGISTIC_FIELDS.map((f) => (
                  <FormInput
                    key={f.key}
                    label={f.label}
                    value={
                      invoiceData.logisticInfo[
                        f.key as keyof typeof invoiceData.logisticInfo
                      ]
                    }
                    onChange={(v) =>
                      handleInputChange('logisticInfo', f.key, v)
                    }
                    placeholder={f.placeholder}
                  />
                ))}
                <FormInput
                  label="DISPATCH DATE"
                  type="date"
                  value={invoiceData.logisticInfo.shipDate}
                  onChange={(v) =>
                    handleInputChange('logisticInfo', 'shipDate', v)
                  }
                />
              </div>
            </div>

            {/* DYNAMIC SPECS ROW GEN */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Line Item Specifications
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200/50 rounded-xl px-3 py-1.5 hover:bg-teal-100 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Item Row
                </button>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {invoiceData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/40 items-end"
                  >
                    <div className="w-full md:w-[12%]">
                      <FormInput
                        label="ID"
                        value={item.no}
                        onChange={(v) => handleItemChange(item.id, 'no', v)}
                      />
                    </div>
                    <div className="w-full md:w-[48%]">
                      <FormInput
                        label="Description"
                        value={item.description}
                        onChange={(v) =>
                          handleItemChange(item.id, 'description', v)
                        }
                        placeholder="500ml Premium Bottle (Box of 24)"
                      />
                    </div>
                    <div className="w-full md:w-[15%]">
                      <FormInput
                        label="QTY"
                        type="number"
                        value={item.qty.toString()}
                        onChange={(v) =>
                          handleItemChange(item.id, 'qty', Number(v))
                        }
                      />
                    </div>
                    <div className="w-full md:w-[20%]">
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
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2.5 mb-0.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors w-full md:w-auto flex justify-center items-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* LEDGER CHARGES OVERHEADS */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                Ledger Adjustments
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <FormInput
                  label="Tax Rate (%)"
                  type="number"
                  value={invoiceData.taxRate.toString()}
                  onChange={(v) =>
                    setInvoiceData((p) => ({ ...p, taxRate: Number(v) }))
                  }
                />
                <FormInput
                  label="Shipping Charges (Rs)"
                  type="number"
                  value={invoiceData.shipping.toString()}
                  onChange={(v) =>
                    setInvoiceData((p) => ({ ...p, shipping: Number(v) }))
                  }
                />
                <FormInput
                  label="Misc Charges (Rs)"
                  type="number"
                  value={invoiceData.other.toString()}
                  onChange={(v) =>
                    setInvoiceData((p) => ({ ...p, other: Number(v) }))
                  }
                />
                <FormInput
                  label="Previous Due Arrears (Rs)"
                  type="number"
                  value={invoiceData.previousDue.toString()}
                  onChange={(v) =>
                    setInvoiceData((p) => ({ ...p, previousDue: Number(v) }))
                  }
                />
                <FormInput
                  label="Amount Paid By Client (Rs)"
                  type="number"
                  value={invoiceData.payment.paidAmount.toString()}
                  onChange={(v) =>
                    handleInputChange('payment', 'paidAmount', Number(v))
                  }
                />

                <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-3 flex flex-col justify-center items-end text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Net Balance Due
                  </span>
                  <span className="text-base font-black text-teal-700 font-mono">
                    Rs {balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* GENERAL STATE NOTIFICATIONS */}
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

            {/* RUN BUTTON */}
            <Button
              label={
                isPrinting
                  ? 'Compiling Invoice Template...'
                  : 'Save & Download Invoice'
              }
              type="submit"
              loading={isPrinting}
              className="w-full py-3.5 rounded-2xl font-bold uppercase text-xs tracking-wider"
            />
          </form>
        </div>
      </main>

      {/* BACKGROUND GENERATION ENGINE DOM CONTAINER */}
      <div className="hidden">
        <InvoiceTemplate
          invoiceData={invoiceData}
          logisticFields={LOGISTIC_FIELDS}
          subtotal={subtotal}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
          balanceDue={balanceDue}
        />
      </div>
    </div>
  );
}

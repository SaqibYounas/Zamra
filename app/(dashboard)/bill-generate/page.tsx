'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../src/components/button/Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  poc: string;
}

interface MetaInfo {
  date: string;
  invoiceNo: string;
}

interface BillToInfo {
  attn: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

interface ShipToInfo {
  attn: string;
  name: string;
  address: string;
  city: string;
  phone: string;
}

interface LogisticInfo {
  poNo: string;
  shipDate: string;
  shipVia: string;
  salesperson: string;
  fob: string;
  terms: string;
}

interface InvoiceItem {
  id: number;
  no: string;
  description: string;
  qty: number;
  unitPrice: number;
}

interface PaymentInfo {
  paidAmount: number;
}

interface InvoiceData {
  companyInfo: CompanyInfo;
  meta: MetaInfo;
  billTo: BillToInfo;
  shipTo: ShipToInfo;
  logisticInfo: LogisticInfo;
  items: InvoiceItem[];
  previousDue: number;
  payment: PaymentInfo;
  taxRate: number;
  shipping: number;
  other: number;
}

interface PdfEngine {
  jsPDF: new (options?: Record<string, unknown>) => unknown;
  html2canvas: (
    element: HTMLElement,
    options?: Record<string, unknown>
  ) => Promise<HTMLCanvasElement>;
}

type ObjectSectionKey =
  | 'companyInfo'
  | 'meta'
  | 'billTo'
  | 'shipTo'
  | 'logisticInfo'
  | 'payment';

const LOGISTIC_FIELDS: { key: keyof LogisticInfo; label: string }[] = [
  { key: 'poNo', label: 'P.O. NO.' },
  { key: 'shipDate', label: 'DISPATCH DATE' },
  { key: 'shipVia', label: 'SHIP VIA' },
  { key: 'salesperson', label: 'REP' },
  { key: 'fob', label: 'F.O.B.' },
  { key: 'terms', label: 'TERMS' },
];

const todayISO = () => new Date().toISOString().split('T')[0];

interface InfoRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  type = 'text',
}) => (
  <div className="flex items-baseline gap-2">
    <span className="w-[64px] shrink-0 text-black font-bold text-[11px]">
      {label}
    </span>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`flex-1 min-w-0 border-none focus:ring-0 text-[11px] font-medium bg-transparent p-0 m-0 ${
        disabled ? 'text-slate-400 opacity-60' : 'text-slate-700'
      }`}
    />
  </div>
);

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
    invoiceNo: 'ZAM-246',
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
  previousDue: 0,
  payment: { paidAmount: 0 },
  taxRate: 3.8,
  shipping: 30.0,
  other: 15.0,
};

const App = () => {
  const [isShippingSame, setIsShippingSame] = useState(false);
  const [invoiceData, setInvoiceData] =
    useState<InvoiceData>(initialInvoiceData);
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfEngine, setPdfEngine] = useState<PdfEngine | null>(null);

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
    <K extends ObjectSectionKey>(
      section: K,
      field: keyof InvoiceData[K],
      value: string | number
    ) => {
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
          qty: 0,
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

  const BASE_ITEM_COUNT = 5;
  const itemCount = invoiceData.items.length;
  const spacingScale = Math.min(
    2.2,
    Math.max(0.6, 1 + (BASE_ITEM_COUNT - itemCount) * 0.25)
  );
  const sectionSpacing = {
    header: Math.round(24 * spacingScale),
    billShip: Math.round(20 * spacingScale),
    logistics: Math.round(20 * spacingScale),
    itemsBottom: Math.round(16 * spacingScale),
    totalsTop: Math.round(16 * spacingScale),
  };

  const handlePrint = async () => {
    if (isPrinting) return;
    if (!pdfEngine) {
      alert('PDF engine is still loading — please try again in a moment.');
      return;
    }

    const source = document.getElementById('invoice-doc');
    if (!source) return;

    setIsPrinting(true);

    const clone = source.cloneNode(true) as HTMLElement;
    clone.style.width = '800px';
    clone.style.maxWidth = 'none';
    clone.style.height = '1120px';
    clone.style.minHeight = '1120px';
    clone.style.background = '#ffffff';

    Array.from(clone.querySelectorAll('*')).forEach((el) => {
      const element = el as HTMLElement;
      element.style.setProperty('color-space', 'srgb', 'important');
    });
    clone.querySelectorAll('[data-pdf-exclude]').forEach((el) => el.remove());

    clone.querySelectorAll('input, textarea').forEach((field) => {
      const el = field as HTMLInputElement | HTMLTextAreaElement;
      if (el.type === 'checkbox') {
        el.remove();
        return;
      }
      const span = document.createElement('span');
      span.textContent = el.value;
      span.className = el.className;
      span.style.border = 'none';
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre-wrap';
      el.replaceWith(span);
    });

    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '-9999px';
    host.style.zIndex = '-1';
    host.appendChild(clone);
    document.body.appendChild(host);

    try {
      const canvas = await pdfEngine.html2canvas(clone, {
        scale: 2.2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      interface InstanceWithInternalPageSize {
        internal: {
          pageSize: {
            getWidth: () => number;
            getHeight: () => number;
          };
        };
        addImage: (
          data: string,
          format: string,
          x: number,
          y: number,
          w: number,
          h: number
        ) => void;
        addPage: () => void;
        save: (filename: string) => void;
      }

      const pdf = new (pdfEngine.jsPDF as unknown as new (
        options?: Record<string, unknown>
      ) => InstanceWithInternalPageSize)({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= usableHeight) {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
      } else {
        const pageHeightInCanvasPx = (usableHeight * canvas.width) / imgWidth;
        let renderedHeight = 0;
        let pageIndex = 0;

        while (renderedHeight < canvas.height) {
          const sliceHeight = Math.min(
            pageHeightInCanvasPx,
            canvas.height - renderedHeight
          );

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          const ctx = pageCanvas.getContext('2d');
          ctx?.drawImage(
            canvas,
            0,
            renderedHeight,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);
          const pageImgHeight = (sliceHeight * imgWidth) / canvas.width;

          if (pageIndex > 0) pdf.addPage();
          pdf.addImage(
            pageImgData,
            'JPEG',
            margin,
            margin,
            imgWidth,
            pageImgHeight
          );

          renderedHeight += sliceHeight;
          pageIndex += 1;
        }
      }

      pdf.save(`Invoice_${invoiceData.meta.invoiceNo || 'draft'}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Could not generate the PDF. Please try again.');
    } finally {
      if (document.body.contains(host)) {
        document.body.removeChild(host);
      }
      setIsPrinting(false);
    }
  };

  return (
    <div className="min-h-screen mt-16 md:mt-20 lg:mt-0 bg-slate-50/40 p-4 md:p-8 font-sans print:bg-white print:p-0 md:ml-16">
      {/* ACTION BAR */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm print:hidden">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-teal-600 rounded-full" />
          POS Terminal Engine
        </h2>
        {/* 🛡️ FIXED LABEL PROPERTY PROPS TYPE FROM ELEMENT TO STRING */}
        <Button
          label={isPrinting ? 'Compiling Document...' : 'Download Invoice'}
          onClick={handlePrint}
          loading={isPrinting}
          className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
            isPrinting
              ? 'bg-teal-700/80 text-teal-100 cursor-not-allowed'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        />
      </div>

      {/* INVOICE SHEET */}
      <div
        id="invoice-doc"
        className="max-w-4xl mx-auto bg-white p-6 md:p-12 print:p-0 h-[1120px] min-h-[1120px] flex flex-col text-slate-800 text-xs border border-slate-300 shadow-sm print:shadow-none"
      >
        {/* HEADER */}
        <div
          className="border-b border-slate-100 pb-4"
          style={{ marginBottom: sectionSpacing.header }}
        >
          <div className="flex justify-between items-baseline mb-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {invoiceData.companyInfo.name}
            </h1>
            <div className="flex gap-6 text-[11px] font-mono text-slate-500">
              <div>
                <span className="font-sans text-black font-bold">Date:</span>{' '}
                <input
                  type="date"
                  value={invoiceData.meta.date}
                  onChange={(e) =>
                    handleInputChange('meta', 'date', e.target.value)
                  }
                  className="w-24 text-slate-700 font-bold font-mono focus:ring-0 text-[11px]"
                />
              </div>
              <div>
                <span className="font-sans text-black font-bold">
                  Invoice No:
                </span>{' '}
                <input
                  value={invoiceData.meta.invoiceNo}
                  onChange={(e) =>
                    handleInputChange('meta', 'invoiceNo', e.target.value)
                  }
                  className="w-16 text-teal-600 font-black font-mono focus:ring-0 text-[11px]"
                  title="Invoice Tracking ID"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-50">
            <div>
              <span className="text-black font-bold">Manager:</span>{' '}
              <input
                value={invoiceData.companyInfo.poc}
                onChange={(e) =>
                  handleInputChange('companyInfo', 'poc', e.target.value)
                }
                className="w-24 text-slate-700 font-medium focus:ring-0 text-[11px]"
              />
            </div>
            <div>
              <span className="text-black font-bold">Address:</span>{' '}
              <input
                value={invoiceData.companyInfo.address}
                onChange={(e) =>
                  handleInputChange('companyInfo', 'address', e.target.value)
                }
                className="w-48 text-slate-700 font-medium focus:ring-0 text-[11px]"
              />
            </div>
            <div>
              <span className="text-black font-bold">City:</span>{' '}
              <input
                value={invoiceData.companyInfo.city}
                onChange={(e) =>
                  handleInputChange('companyInfo', 'city', e.target.value)
                }
                className="w-24 text-slate-700 font-medium focus:ring-0 text-[11px]"
              />
            </div>
            <div>
              <span className="text-black font-bold">Desk:</span>{' '}
              <input
                value={invoiceData.companyInfo.phone}
                onChange={(e) =>
                  handleInputChange('companyInfo', 'phone', e.target.value)
                }
                className="w-28 text-slate-700 font-medium focus:ring-0 text-[11px]"
              />
            </div>
            <div>
              <span className="text-black font-bold">Email:</span>{' '}
              <input
                value={invoiceData.companyInfo.email}
                onChange={(e) =>
                  handleInputChange('companyInfo', 'email', e.target.value)
                }
                type="email"
                className="w-36 text-slate-700 font-medium focus:ring-0 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* SHIPPING SYNC TOGGLE */}
        <div
          data-pdf-exclude
          className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-lg print:hidden border border-slate-100"
        >
          <input
            id="sameAsBilling"
            type="checkbox"
            className="w-3.5 h-3.5 text-teal-600 border-slate-200 rounded focus:ring-teal-500 cursor-pointer accent-teal-600"
            checked={isShippingSame}
            onChange={(e) => setIsShippingSame(e.target.checked)}
          />
          <label
            htmlFor="sameAsBilling"
            className="text-[10px] font-medium text-slate-500 cursor-pointer select-none"
          >
            Shipping address same as billing address
          </label>
        </div>

        {/* BILL TO / SHIP TO */}
        <div
          className="grid grid-cols-2 gap-8 relative"
          style={{ marginBottom: sectionSpacing.billShip }}
        >
          <div className="flex flex-col">
            <h3 className="text-teal-600 text-[10px] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-0.5">
              Bill To
            </h3>
            <div className="space-y-1.5">
              <InfoRow
                label="Attention"
                value={invoiceData.billTo.attn}
                onChange={(v) => handleInputChange('billTo', 'attn', v)}
              />
              <InfoRow
                label="Company"
                value={invoiceData.billTo.name}
                onChange={(v) => handleInputChange('billTo', 'name', v)}
              />
              <InfoRow
                label="Address"
                value={invoiceData.billTo.address}
                onChange={(v) => handleInputChange('billTo', 'address', v)}
              />
              <InfoRow
                label="City"
                value={invoiceData.billTo.city}
                onChange={(v) => handleInputChange('billTo', 'city', v)}
              />
              <InfoRow
                label="Phone"
                value={invoiceData.billTo.phone}
                onChange={(v) => handleInputChange('billTo', 'phone', v)}
              />
              <InfoRow
                label="Email"
                type="email"
                value={invoiceData.billTo.email}
                onChange={(v) => handleInputChange('billTo', 'email', v)}
              />
            </div>
          </div>

          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200" />

          <div className="flex flex-col">
            <h3 className="text-teal-600 text-[10px] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-0.5">
              Ship To
            </h3>
            <div className="space-y-1.5">
              <InfoRow
                label="Attention"
                value={invoiceData.shipTo.attn}
                onChange={(v) => handleInputChange('shipTo', 'attn', v)}
                disabled={isShippingSame}
              />
              <InfoRow
                label="Company"
                value={invoiceData.shipTo.name}
                onChange={(v) => handleInputChange('shipTo', 'name', v)}
                disabled={isShippingSame}
              />
              <InfoRow
                label="Address"
                value={invoiceData.shipTo.address}
                onChange={(v) => handleInputChange('shipTo', 'address', v)}
                disabled={isShippingSame}
              />
              <InfoRow
                label="City"
                value={invoiceData.shipTo.city}
                onChange={(v) => handleInputChange('shipTo', 'city', v)}
                disabled={isShippingSame}
              />
              <InfoRow
                label="Phone"
                value={invoiceData.shipTo.phone}
                onChange={(v) => handleInputChange('shipTo', 'phone', v)}
                disabled={isShippingSame}
              />
            </div>
          </div>
        </div>

        {/* LOGISTICS ROW */}
        <div
          className="overflow-x-auto border-b border-slate-100"
          style={{ marginBottom: sectionSpacing.logistics }}
        >
          <table className="w-full border-collapse table-fixed min-w-[500px]">
            <thead>
              <tr className="text-black text-[9px] font-bold tracking-wider text-center border-b border-slate-100">
                {LOGISTIC_FIELDS.map(({ key, label }) => (
                  <th
                    key={key}
                    className="pb-1 text-center font-bold bg-transparent text-black border-none uppercase"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {LOGISTIC_FIELDS.map(({ key, label }) => (
                  <td key={key} className="p-0 border-none">
                    <input
                      className="w-full border-none focus:ring-0 text-center text-[11px] py-1 text-slate-700 bg-transparent font-medium"
                      value={invoiceData.logisticInfo[key]}
                      onChange={(e) =>
                        handleInputChange('logisticInfo', key, e.target.value)
                      }
                      title={label}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ITEMS */}
        <div className="flex flex-col">
          <div data-pdf-exclude className="flex justify-end mb-1 print:hidden">
            <button
              type="button"
              onClick={addItem}
              aria-label="Add line item"
              className="flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-600 font-bold rounded text-[10px] hover:bg-slate-100 border border-slate-200/60 shadow-sm transition-all"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>

          <div style={{ marginBottom: sectionSpacing.itemsBottom }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-black text-[10px] font-bold border-b-2 border-slate-200 uppercase tracking-wider">
                  <th className="pb-2 w-12 text-center bg-transparent text-black border-none">
                    Id
                  </th>
                  <th className="pb-2 text-left bg-transparent text-black border-none">
                    Description
                  </th>
                  <th className="pb-2 w-16 text-center bg-transparent text-black border-none">
                    Qty
                  </th>
                  <th className="pb-2 w-24 text-right bg-transparent text-black border-none">
                    Unit Rate
                  </th>
                  <th className="pb-2 w-28 text-right bg-transparent text-black border-none">
                    Amount
                  </th>
                  <th
                    data-pdf-exclude
                    className="w-8 print:hidden bg-transparent border-none"
                  />
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/20">
                    <td className="p-0 text-center border-b border-slate-100">
                      <input
                        className="w-full border-none focus:ring-0 text-center text-[11px] py-1.5 bg-transparent"
                        value={item.no}
                        onChange={(e) =>
                          handleItemChange(item.id, 'no', e.target.value)
                        }
                        title="Index ID"
                      />
                    </td>
                    <td className="p-0 border-b border-slate-100">
                      <input
                        className="w-full border-none focus:ring-0 text-left px-2 text-[11px] py-1.5 bg-transparent"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="Item description..."
                        title="Item Description"
                      />
                    </td>
                    <td className="p-0 text-center border-b border-slate-100">
                      <input
                        type="number"
                        className="w-full border-none focus:ring-0 text-center text-[11px] py-1.5 bg-transparent font-medium"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            'qty',
                            Number(e.target.value)
                          )
                        }
                        title="Quantity"
                      />
                    </td>
                    <td className="p-0 border-b border-slate-100">
                      <div className="flex items-center justify-end px-1">
                        <span className="text-[10px] text-slate-400 mr-1 font-bold">
                          Rs
                        </span>
                        <input
                          type="number"
                          className="w-16 border-none focus:ring-0 text-right text-[11px] py-1.5 bg-transparent font-medium"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'unitPrice',
                              Number(e.target.value)
                            )
                          }
                          title="Unit Price"
                        />
                      </div>
                    </td>
                    <td className="text-right px-1 text-[11px] font-semibold text-slate-700 border-b border-slate-100">
                      <span className="font-bold">Rs</span>{' '}
                      {(item.qty * item.unitPrice).toFixed(2)}
                    </td>
                    <td
                      data-pdf-exclude
                      className="text-center print:hidden border-b border-slate-100 group-hover:bg-rose-50/30 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove line item"
                        className="text-slate-300 hover:text-rose-600 p-1 rounded"
                        title="Remove item"
                      >
                        <Trash2 className="w-3 h-3 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTALS */}
        <div
          className="flex justify-end"
          style={{ marginTop: sectionSpacing.totalsTop }}
        >
          <div className="w-full sm:w-72 space-y-2 text-[11px]">
            <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-100">
              <span className="text-black font-bold">Subtotal:</span>
              <span className="font-mono text-slate-700 font-semibold">
                <span className="font-sans font-bold">Rs</span>{' '}
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-slate-100">
              <span className="flex items-center gap-1 text-black font-bold">
                Tax (
                <input
                  type="number"
                  className="w-6 text-center text-teal-600 font-bold p-0 text-[11px] bg-transparent"
                  value={invoiceData.taxRate}
                  onChange={(e) =>
                    setInvoiceData((p) => ({
                      ...p,
                      taxRate: Number(e.target.value),
                    }))
                  }
                  title="Tax rate"
                />
                %):
              </span>
              <span className="font-mono text-slate-600 font-medium">
                <span className="font-sans font-bold">Rs</span>{' '}
                {taxAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-slate-100">
              <span className="text-black font-bold">Shipping:</span>
              <div className="flex items-center font-mono">
                <span className="text-[10px] text-slate-400 mr-0.5 font-bold">
                  Rs
                </span>
                <input
                  type="number"
                  className="w-16 text-right p-0 text-[11px] font-mono font-medium text-slate-700 bg-transparent"
                  value={invoiceData.shipping}
                  onChange={(e) =>
                    setInvoiceData((p) => ({
                      ...p,
                      shipping: Number(e.target.value),
                    }))
                  }
                  title="Shipping cost"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-slate-100">
              <span className="text-black font-bold">Misc Charges:</span>
              <div className="flex items-center font-mono">
                <span className="text-[10px] text-slate-400 mr-0.5 font-bold">
                  Rs
                </span>
                <input
                  type="number"
                  className="w-16 text-right p-0 text-[11px] font-mono font-medium text-slate-700 bg-transparent"
                  value={invoiceData.other}
                  onChange={(e) =>
                    setInvoiceData((p) => ({
                      ...p,
                      other: Number(e.target.value),
                    }))
                  }
                  title="Other charges"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-rose-600 pb-1 border-b border-slate-100 font-semibold">
              <span className="text-black font-bold">Previous Due:</span>
              <div className="flex items-center font-mono">
                <span className="text-[10px] text-rose-400 mr-0.5 font-bold">
                  Rs
                </span>
                <input
                  type="number"
                  className="w-16 text-right p-0 text-[11px] font-mono font-bold text-rose-600 bg-transparent"
                  value={invoiceData.previousDue}
                  onChange={(e) =>
                    setInvoiceData((p) => ({
                      ...p,
                      previousDue: Number(e.target.value),
                    }))
                  }
                  title="Previous balance due"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-slate-100">
              <span className="text-black font-bold">Amount Paid:</span>
              <div className="flex items-center font-mono bg-emerald-50/20 px-1 rounded">
                <span className="text-[10px] text-slate-400 mr-0.5 font-bold">
                  Rs
                </span>
                <input
                  type="number"
                  className="w-16 text-right p-0 text-[11px] font-mono font-bold text-emerald-700 bg-transparent"
                  value={invoiceData.payment.paidAmount}
                  onChange={(e) =>
                    handleInputChange(
                      'payment',
                      'paidAmount',
                      Number(e.target.value)
                    )
                  }
                  title="Amount paid"
                />
              </div>
            </div>

            <div className="flex justify-between text-slate-800 font-bold pb-1 border-b border-slate-100">
              <span className="text-black font-bold">Balance Due:</span>
              <span className="font-mono text-rose-600">
                <span className="font-sans font-bold">Rs</span>{' '}
                {balanceDue.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 text-slate-900 border-t-2 border-slate-900">
              <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                Total:
              </span>
              <span className="font-mono text-sm font-black text-slate-900">
                <span className="font-sans font-bold">Rs</span>{' '}
                {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER - ALIGNED DIRECTLY TO BOTTOM OF SHEET */}
        <div className="text-center pt-4 border-t border-slate-50 mt-auto">
          <div className="text-[10px] font-black text-teal-600 tracking-[0.4em] uppercase">
            Thank You For Your Business
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        @media print {
          #invoice-doc {
            height: 1120px !important;
            min-height: 1120px !important;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default App;

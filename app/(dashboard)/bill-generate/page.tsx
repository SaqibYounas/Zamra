'use client';
import React, { useState, useRef } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';

const App = () => {
  const [invoiceData, setInvoiceData] = useState({
    companyInfo: {
      name: 'Zamra Water',
      address: '123 Main Street',
      city: 'Hamilton, OH 44416',
      phone: '(321) 456-7890',
      email: 'hello@zamrawater.com',
      poc: 'Sufyan Malik',
    },
    meta: {
      date: '2026-04-04',
      invoiceNo: 'A246',
      customerNo: '114H',
    },
    billTo: {
      attn: 'Name / Dept',
      name: 'Client Company',
      address: '456 Client St',
      city: 'City, State Zip',
      phone: '(987) 654-3210',
      email: 'client@email.com',
    },
    shipTo: {
      attn: 'Name / Dept',
      name: 'Client Company',
      address: '456 Client St',
      city: 'City, State Zip',
      phone: '(987) 654-3210',
    },
    logisticInfo: {
      poNo: 'PO-998',
      shipDate: '2026-04-10',
      shipVia: 'Ground',
      salesperson: 'Admin',
      fob: 'Destination',
      terms: 'Net 30',
    },
    items: [
      {
        id: 1,
        no: 'A111',
        description: "Women's Tall - M",
        qty: 10,
        unitPrice: 10.0,
      },
      {
        id: 2,
        no: 'B222',
        description: "Men's Tall - M",
        qty: 5,
        unitPrice: 20.0,
      },
      {
        id: 3,
        no: 'C333',
        description: "Children's - S",
        qty: 10,
        unitPrice: 5.0,
      },
    ],
    remarks: 'Please make check payable to Zamra Water.',
    taxRate: 3.8,
    shipping: 30.0,
    other: 15.0,
  });

  const handleInputChange = (
    section: string,
    field: string | null,
    value: string | number
  ) => {
    if (field === null) {
      setInvoiceData((prev) => ({
        ...prev,
        remarks: value as string,
      }));
      return;
    }
    setInvoiceData((prev) => {
      const newData = { ...prev };
      const sectionKey = section as keyof typeof newData;
      if (
        typeof newData[sectionKey] === 'object' &&
        newData[sectionKey] !== null
      ) {
        (newData[sectionKey] as Record<string, string | number>)[field] = value;
      }
      return newData;
    });
  };

  const handleItemChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      no: '',
      description: '',
      qty: 0,
      unitPrice: 0,
    };
    setInvoiceData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: number) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.qty * item.unitPrice,
    0
  );
  const taxAmount = (subtotal * invoiceData.taxRate) / 100;
  const totalAmount =
    subtotal +
    taxAmount +
    Number(invoiceData.shipping) +
    Number(invoiceData.other);

  const invoiceRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;
    const options = {
      margin: 10,
      filename: `Invoice_${invoiceData.meta.invoiceNo}_${invoiceData.meta.date}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, allowTaint: true, useCORS: true },
      jsPDF: {
        orientation: 'portrait' as const,
        unit: 'mm' as const,
        format: 'a4' as const,
      },
    };

    const clone = element.cloneNode(true) as HTMLDivElement;
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = '210mm';
    clone.style.padding = '20px';
    clone.style.background = 'white';

    clone.querySelectorAll('input, textarea, select').forEach((field) => {
      const span = document.createElement('span');
      const value = (field as HTMLInputElement).value ?? '';
      span.textContent = value;
      span.style.whiteSpace = 'pre-wrap';
      span.style.display = 'block';
      span.style.width = '100%';
      field.replaceWith(span);
    });

    document.body.appendChild(clone);
    await html2pdf().set(options).from(clone).save();
    document.body.removeChild(clone);
  };

  return (
    <div className="min-h-screen mt-4 sm:mt-8 md:mt-10 lg:mt-0 bg-slate-100 p-4 md:p-10 font-sans print:bg-white print:p-0 md:ml-20">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Invoice Editor</h2>
          <p className="text-slate-500 text-sm">Click any field to edit.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div
        id="invoice-doc"
        ref={invoiceRef}
        className="max-w-4xl mx-auto bg-white shadow-2xl p-8 md:p-12 print:shadow-none print:p-10 min-h-screen flex flex-col"
      >
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-teal-700 tracking-tight mb-4 uppercase">
              Invoice Template
            </h1>
            <input
              className="block w-full text-sm font-semibold border-none focus:ring-0 p-0"
              value={invoiceData.companyInfo.name}
              onChange={(e) =>
                handleInputChange('companyInfo', 'name', e.target.value)
              }
              title="Company Name"
            />
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Owner:</span>
              <input
                className="border-none focus:ring-0 p-0 bg-transparent w-auto"
                value={invoiceData.companyInfo.poc}
                onChange={(e) =>
                  handleInputChange('companyInfo', 'poc', e.target.value)
                }
                title="Point of Contact"
              />
            </div>
            <input
              className="block w-full text-xs text-slate-500 border-none focus:ring-0 p-0"
              value={invoiceData.companyInfo.address}
              onChange={(e) =>
                handleInputChange('companyInfo', 'address', e.target.value)
              }
              placeholder="Address"
            />
            <input
              className="block w-full text-xs text-slate-500 border-none focus:ring-0 p-0"
              value={invoiceData.companyInfo.city}
              onChange={(e) =>
                handleInputChange('companyInfo', 'city', e.target.value)
              }
              placeholder="City, State, Zip"
            />
            <input
              className="block w-full text-xs text-slate-500 border-none focus:ring-0 p-0"
              value={invoiceData.companyInfo.phone}
              onChange={(e) =>
                handleInputChange('companyInfo', 'phone', e.target.value)
              }
              placeholder="Phone"
            />
            <input
              className="block w-full text-xs text-slate-500 border-none focus:ring-0 p-0 underline decoration-teal-100"
              value={invoiceData.companyInfo.email}
              onChange={(e) =>
                handleInputChange('companyInfo', 'email', e.target.value)
              }
              placeholder="Email"
            />
          </div>

          <div className="w-64 space-y-2">
            <div className="flex flex-col">
              <span className="bg-teal-600 text-white text-[10px] font-bold py-1 px-3 text-center uppercase tracking-widest">
                Date
              </span>
              <input
                type="date"
                className="border border-teal-100 text-center text-xs py-1.5 focus:ring-1 focus:ring-teal-500"
                value={invoiceData.meta.date}
                onChange={(e) =>
                  handleInputChange('meta', 'date', e.target.value)
                }
                title="Invoice Date"
              />
            </div>
            <div className="flex flex-col">
              <span className="bg-teal-600 text-white text-[10px] font-bold py-1 px-3 text-center uppercase tracking-widest">
                Invoice No.
              </span>
              <input
                className="border border-teal-100 text-center text-xs py-1.5 focus:ring-1 focus:ring-teal-500"
                value={invoiceData.meta.invoiceNo}
                onChange={(e) =>
                  handleInputChange('meta', 'invoiceNo', e.target.value)
                }
                placeholder="Invoice No"
              />
            </div>
            <div className="flex flex-col">
              <span className="bg-teal-600 text-white text-[10px] font-bold py-1 px-3 text-center uppercase tracking-widest">
                Customer No.
              </span>
              <input
                className="border border-teal-100 text-center text-xs py-1.5 focus:ring-1 focus:ring-teal-500"
                value={invoiceData.meta.customerNo}
                onChange={(e) =>
                  handleInputChange('meta', 'customerNo', e.target.value)
                }
                placeholder="Customer No"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="bg-teal-600 text-white text-[10px] font-black py-1 px-3 uppercase tracking-widest mb-2">
              Bill To
            </h3>
            <div className="space-y-0.5 text-xs">
              <input
                className="w-full border-none focus:ring-0 p-0 font-bold"
                value={invoiceData.billTo.attn}
                onChange={(e) =>
                  handleInputChange('billTo', 'attn', e.target.value)
                }
                placeholder="ATTN: Name / Dept"
                title="Attention"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.billTo.name}
                onChange={(e) =>
                  handleInputChange('billTo', 'name', e.target.value)
                }
                placeholder="Company Name"
                title="Company Name"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.billTo.address}
                onChange={(e) =>
                  handleInputChange('billTo', 'address', e.target.value)
                }
                placeholder="Address"
                title="Address"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.billTo.city}
                onChange={(e) =>
                  handleInputChange('billTo', 'city', e.target.value)
                }
                placeholder="City, State Zip"
                title="City"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.billTo.phone}
                onChange={(e) =>
                  handleInputChange('billTo', 'phone', e.target.value)
                }
                placeholder="Phone"
                title="Phone"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.billTo.email}
                onChange={(e) =>
                  handleInputChange('billTo', 'email', e.target.value)
                }
                placeholder="Email"
                title="Email"
              />
            </div>
          </div>
          <div>
            <h3 className="bg-teal-600 text-white text-[10px] font-black py-1 px-3 uppercase tracking-widest mb-2">
              Ship To
            </h3>
            <div className="space-y-0.5 text-xs">
              <input
                className="w-full border-none focus:ring-0 p-0 font-bold"
                value={invoiceData.shipTo.attn}
                onChange={(e) =>
                  handleInputChange('shipTo', 'attn', e.target.value)
                }
                placeholder="ATTN: Name / Dept"
                title="Attention"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.shipTo.name}
                onChange={(e) =>
                  handleInputChange('shipTo', 'name', e.target.value)
                }
                placeholder="Company Name"
                title="Company Name"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.shipTo.address}
                onChange={(e) =>
                  handleInputChange('shipTo', 'address', e.target.value)
                }
                placeholder="Address"
                title="Address"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.shipTo.city}
                onChange={(e) =>
                  handleInputChange('shipTo', 'city', e.target.value)
                }
                placeholder="City, State Zip"
                title="City"
              />
              <input
                className="w-full border-none focus:ring-0 p-0"
                value={invoiceData.shipTo.phone}
                onChange={(e) =>
                  handleInputChange('shipTo', 'phone', e.target.value)
                }
                placeholder="Phone"
                title="Phone"
              />
            </div>
          </div>
        </div>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-teal-500 text-white">
              {[
                'P.O. NO.',
                'SHIP DATE',
                'SHIP VIA',
                'SALESPERSON',
                'F.O.B.',
                'TERMS',
              ].map((h) => (
                <th
                  key={h}
                  className="border border-teal-600 px-2 py-2 text-[10px] font-black uppercase tracking-tighter"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.keys(invoiceData.logisticInfo).map((key) => (
                <td key={key} className="border border-teal-100 p-0">
                  <input
                    className="w-full border-none focus:ring-0 text-center text-[11px] py-2"
                    value={
                      invoiceData.logisticInfo[
                        key as keyof typeof invoiceData.logisticInfo
                      ]
                    }
                    onChange={(e) =>
                      handleInputChange('logisticInfo', key, e.target.value)
                    }
                    title={key}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <div className="grow flex flex-col">
          <div className="flex justify-end mb-2 print:hidden">
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 font-bold rounded-lg text-[10px] hover:bg-teal-100 transition-all border border-teal-200"
            >
              <Plus className="w-3 h-3" /> Add New Item
            </button>
          </div>

          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-teal-500 text-white">
                <th className="border border-teal-600 px-3 py-2 text-[10px] font-black uppercase w-20">
                  Item No.
                </th>
                <th className="border border-teal-600 px-3 py-2 text-[10px] font-black uppercase text-left">
                  Description
                </th>
                <th className="border border-teal-600 px-3 py-2 text-[10px] font-black uppercase w-20">
                  Qty
                </th>
                <th className="border border-teal-600 px-3 py-2 text-[10px] font-black uppercase w-24">
                  Unit Price
                </th>
                <th className="border border-teal-600 px-3 py-2 text-[10px] font-black uppercase w-28">
                  Total
                </th>
                <th className="border border-teal-600 px-2 py-2 w-10 print:hidden bg-slate-50 text-slate-400"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="border border-teal-100 p-0">
                    <input
                      className="w-full border-none focus:ring-0 text-center text-xs py-2"
                      value={item.no}
                      onChange={(e) =>
                        handleItemChange(item.id, 'no', e.target.value)
                      }
                      title="Item No"
                    />
                  </td>
                  <td className="border border-teal-100 p-0">
                    <input
                      className="w-full border-none focus:ring-0 text-left px-3 text-xs py-2"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, 'description', e.target.value)
                      }
                      placeholder="Description"
                      title="Description"
                    />
                  </td>
                  <td className="border border-teal-100 p-0">
                    <input
                      type="number"
                      className="w-full border-none focus:ring-0 text-center text-xs py-2"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(item.id, 'qty', e.target.value)
                      }
                      title="Quantity"
                    />
                  </td>
                  <td className="border border-teal-100 p-0">
                    <div className="flex items-center px-2">
                      <span className="text-xs text-slate-400">$</span>
                      <input
                        type="number"
                        className="w-full border-none focus:ring-0 text-right text-xs py-2"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(item.id, 'unitPrice', e.target.value)
                        }
                        title="Unit Price"
                      />
                    </div>
                  </td>
                  <td className="border border-teal-100 text-right px-3 text-xs font-bold text-slate-700 bg-slate-50/30">
                    ${(item.qty * item.unitPrice).toFixed(2)}
                  </td>
                  <td className="border border-teal-100 text-center print:hidden group-hover:bg-rose-50 transition-colors">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              {[...Array(Math.max(0, 8 - invoiceData.items.length))].map(
                (_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-teal-100 py-4"></td>
                    <td className="border border-teal-100 py-4"></td>
                    <td className="border border-teal-100 py-4"></td>
                    <td className="border border-teal-100 py-4"></td>
                    <td className="border border-teal-100 py-4 bg-slate-50/30"></td>
                    <td className="border border-teal-100 py-4 print:hidden"></td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-start mt-auto pt-6 border-t-2 border-teal-100">
          <div className="w-1/2">
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
              Remarks / Instructions:
            </label>
            <textarea
              className="w-full border-none focus:ring-0 p-0 text-xs text-slate-600 bg-transparent resize-none leading-relaxed"
              rows={4}
              value={invoiceData.remarks}
              onChange={(e) => handleInputChange('', null, e.target.value)}
              placeholder="Remarks / Instructions"
              title="Remarks"
            />
          </div>

          <div className="w-1/3">
            <div className="grid grid-cols-2 border border-teal-100 overflow-hidden rounded-lg">
              <div className="bg-teal-500 text-white text-[10px] font-black p-2 uppercase flex items-center">
                Subtotal
              </div>
              <div className="p-2 text-right text-xs font-bold text-slate-700 bg-white border-l border-teal-100">
                ${subtotal.toFixed(2)}
              </div>

              <div className="bg-teal-50 px-2 py-1 border-t border-teal-100 flex items-center justify-between">
                <span className="text-[9px] font-black text-teal-800 uppercase">
                  Tax
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="w-10 border-none bg-white focus:ring-0 text-[10px] p-0 font-bold text-teal-700 text-right rounded"
                    value={invoiceData.taxRate}
                    onChange={(e) =>
                      setInvoiceData((p) => ({
                        ...p,
                        taxRate: Number(e.target.value),
                      }))
                    }
                    title="Tax Rate"
                  />
                  <span className="text-[9px] font-bold text-teal-700">%</span>
                </div>
              </div>
              <div className="p-2 text-right text-xs text-slate-600 bg-white border-t border-l border-teal-100">
                ${taxAmount.toFixed(2)}
              </div>

              <div className="bg-teal-50 p-2 text-[10px] font-black text-teal-800 uppercase border-t border-teal-100">
                Shipping
              </div>
              <div className="p-1 text-right bg-white border-t border-l border-teal-100">
                <input
                  type="number"
                  className="w-full border-none focus:ring-0 text-xs p-1 text-right"
                  value={invoiceData.shipping}
                  onChange={(e) =>
                    setInvoiceData((p) => ({
                      ...p,
                      shipping: Number(e.target.value),
                    }))
                  }
                  title="Shipping"
                />
              </div>

              <div className="bg-teal-50 p-2 text-[10px] font-black text-teal-800 uppercase border-t border-teal-100">
                Other
              </div>
              <div className="p-1 text-right bg-white border-t border-l border-teal-100">
                <input
                  type="number"
                  className="w-full border-none focus:ring-0 text-xs p-1 text-right"
                  value={invoiceData.other}
                  onChange={(e) =>
                    setInvoiceData((p) => ({
                      ...p,
                      other: Number(e.target.value),
                    }))
                  }
                  title="Other Charges"
                />
              </div>

              <div className="bg-teal-700 text-white text-xs font-black p-3 uppercase flex items-center border-t border-teal-800">
                Total
              </div>
              <div className="p-3 text-right text-base font-black text-slate-900 bg-teal-50 border-t border-l border-teal-800">
                $
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] italic text-slate-400 mb-2">
            Please make check payable to {invoiceData.companyInfo.name}.
          </p>
          <div className="text-sm font-black text-teal-600 tracking-[0.2em] uppercase">
            Thank You
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { background-color: white !important; margin: 0 !important; padding: 0 !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; }
          input, textarea { border: none !important; outline: none !important; box-shadow: none !important; }
          .print\\:hidden { display: none !important; }
          .shadow-2xl { box-shadow: none !important; }
          #invoice-doc { width: 100% !important; margin: 0 !important; padding: 40px !important; }
        }
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `,
        }}
      />
    </div>
  );
};

export default App;

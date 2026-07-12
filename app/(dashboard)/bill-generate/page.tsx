'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import {
  InvoiceForm,
  LOGISTIC_FIELDS,
  FormStatus,
  DropdownState,
} from './components/InvoiceForm';
import { InvoiceData, ObjectSectionKey, InvoiceItem } from '../types/types';
const todayISO = () => new Date().toISOString().split('T')[0];

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
  previousDue: 1500,
  payment: { paidAmount: 1000 },
  taxRate: 3.8,
  shipping: 120,
  other: 50,
};

const initialStatus: FormStatus = {
  isShippingSame: false,
  isPrinting: false,
  error: '',
  successMessage: '',
  fieldErrors: {},
};

const initialDropdowns: DropdownState = {
  customers: [],
  shippingProfiles: [],
  selectedCustomerId: '',
  selectedShippingId: '',
  loading: false,
  error: '',
};

export default function InvoiceFormDashboard() {
  const [invoiceData, setInvoiceData] =
    useState<InvoiceData>(initialInvoiceData);
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [dropdowns, setDropdowns] = useState<DropdownState>(initialDropdowns);

  const patchStatus = useCallback((patch: Partial<FormStatus>) => {
    setStatus((prev) => ({ ...prev, ...patch }));
  }, []);

  const patchDropdowns = useCallback((patch: Partial<DropdownState>) => {
    setDropdowns((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      patchDropdowns({ loading: true, error: '' });
      try {
        const [customersRes, shippingRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/shipping-addresses'),
        ]);

        if (!customersRes.ok || !shippingRes.ok) {
          throw new Error('Dropdown fetch failed');
        }

        const customersData = await customersRes.json();
        const shippingData = await shippingRes.json();

        patchDropdowns({
          customers: Array.isArray(customersData) ? customersData : [],
          shippingProfiles: Array.isArray(shippingData) ? shippingData : [],
        });
      } catch (err) {
        console.error('Failed to load dropdown data', err);
        patchDropdowns({
          error: 'Could not load saved customers/warehouses.',
        });
      } finally {
        patchDropdowns({ loading: false });
      }
    };

    fetchDropdownData();
  }, [patchDropdowns]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.matchMedia) {
      window.matchMedia = () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      });
    }
  }, []);

  useEffect(() => {
    if (!status.isShippingSame) return;
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
  }, [status.isShippingSame, invoiceData.billTo]);

  const handleInputChange = useCallback(
    (section: ObjectSectionKey, field: string, value: string | number) => {
      setInvoiceData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    },
    []
  );

  const handleLedgerChange = useCallback(
    (
      field: 'taxRate' | 'shipping' | 'other' | 'previousDue',
      value: number
    ) => {
      setInvoiceData((prev) => ({ ...prev, [field]: value }));
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

  const handleCustomerSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      patchDropdowns({ selectedCustomerId: id });
      if (!id) return;

      const customer = dropdowns.customers.find((c) => c.id.toString() === id);
      if (!customer) return;

      setInvoiceData((prev) => ({
        ...prev,
        billTo: {
          attn: customer.attn || '',
          name: customer.name || '',
          address: customer.address || '',
          city: customer.city || '',
          phone: customer.phone || '',
          email: customer.email || '',
        },
      }));

      patchStatus({
        fieldErrors: {
          ...status.fieldErrors,
          name: '',
          phone: '',
          address: '',
          city: '',
          email: '',
        },
      });
    },
    [dropdowns.customers, patchDropdowns, patchStatus, status.fieldErrors]
  );

  const handleShippingSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      patchDropdowns({ selectedShippingId: id });
      if (!id) return;

      const profile = dropdowns.shippingProfiles.find(
        (s) => s.id.toString() === id
      );
      if (!profile) return;

      patchStatus({ isShippingSame: false });

      setInvoiceData((prev) => ({
        ...prev,
        shipTo: {
          attn: profile.attn || '',
          name: profile.name || '',
          address: profile.address || '',
          city: profile.city || '',
          phone: profile.phone || '',
        },
      }));
    },
    [dropdowns.shippingProfiles, patchDropdowns, patchStatus]
  );

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
    if (typeof window === 'undefined') return;

    patchStatus({ error: '', successMessage: '' });

    const localErrors: Record<string, string> = {};
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
      patchStatus({
        fieldErrors: localErrors,
        error: 'Please fix the empty parameters marked below.',
      });

      const firstEmptyFieldKey = Object.keys(localErrors)[0];
      setTimeout(() => {
        const inputElement = document.querySelector(
          `input[name="${firstEmptyFieldKey}"]`
        ) as HTMLInputElement;
        inputElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputElement?.focus();
      }, 100);
      return;
    }

    if (invoiceData.items.length === 0 || !invoiceData.items[0].description) {
      patchStatus({
        error:
          'Please append at least one valid row item description parameter.',
      });
      return;
    }

    patchStatus({
      fieldErrors: {},
      successMessage: 'Invoice parameters validated. Loading libraries...',
      isPrinting: true,
    });

    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas-pro'),
      ]);

      const source = document.getElementById('invoice-doc');
      if (!source) {
        patchStatus({
          error: 'Invoice layout DOM not found.',
          isPrinting: false,
        });
        return;
      }

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

      const canvas = await html2canvas(clone, {
        scale: 2.2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

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

      patchStatus({ successMessage: 'Invoice downloaded successfully!' });
      document.body.removeChild(host);
    } catch (e) {
      console.error(e);
      patchStatus({
        error: 'Failed to render standard PDF template binaries.',
      });
    } finally {
      patchStatus({ isPrinting: false });
    }
  };

  return (
    <>
      <InvoiceForm
        invoiceData={invoiceData}
        status={status}
        dropdowns={dropdowns}
        balanceDue={balanceDue}
        onShippingSameToggle={() =>
          patchStatus({ isShippingSame: !status.isShippingSame })
        }
        onCustomerSelect={handleCustomerSelect}
        onShippingSelect={handleShippingSelect}
        onInputChange={handleInputChange}
        onItemChange={handleItemChange}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onLedgerChange={handleLedgerChange}
        onSubmit={handleValidationAndPrint}
      />

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
    </>
  );
}

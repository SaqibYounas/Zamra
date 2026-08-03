'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import {
  InvoiceForm,
  LOGISTIC_FIELDS,
  FormStatus,
  DropdownState,
} from './components/InvoiceForm';
import { InvoiceData, ObjectSectionKey, InvoiceItem } from '../types/types';
import { fetchCustomers } from '../services/getCustomers';
import { fetchShipping } from '../services/getShipping';
import { submitInvoice } from '../services/submitInvoice';
import { currentSellingPrice } from '../services/sellingPrice';

type CustomerApiResponse = {
  id: number;
  companyName: string;
  attentionPoc: string;
  mailingAddress: string;
  city: string;
  phone: string;
  email: string;
};

type ShippingApiResponse = {
  id: number;
  warehouseName: string;
  attentionTo: string;
  deliveryAddress: string;
  phone: string;
};

const todayISO = () => new Date().toISOString().split('T')[0];
const generateInvoiceNo = () => `ZAM-${Date.now()}`;
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
    invoiceNo: generateInvoiceNo().slice(0, 9),
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
      bottleType: '',
    },
    {
      id: 2,
      no: '2',
      description: '1.5L Premium Bottle (Box of 12)',
      qty: 5,
      unitPrice: 80.0,
      bottleType: '',
    },
    {
      id: 3,
      no: '3',
      description: '19L Corporate Water Gallon',
      qty: 2,
      unitPrice: 250.0,
      bottleType: '',
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
  customersLoading: false,
  customersLoaded: false,
  shippingLoading: false,
  shippingLoaded: false,
  error: '',
};

interface sellingPriceRequestBody {
  sellingPrice: string;
  priceManagementId: number;
  priceManagement: {
    bottleType: string;
  };
}

export default function InvoiceFormDashboard() {
  const [invoiceData, setInvoiceData] =
    useState<InvoiceData>(initialInvoiceData);
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [dropdowns, setDropdowns] = useState<DropdownState>(initialDropdowns);
  const [prices, setPrices] = useState<sellingPriceRequestBody[]>([]);

  const patchStatus = useCallback((patch: Partial<FormStatus>) => {
    setStatus((prev) => ({ ...prev, ...patch }));
  }, []);

  async function getPrices() {
    try {
      const sellingprice = await currentSellingPrice();
      setPrices(sellingprice.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPrices();
  }, []);

  const patchDropdowns = useCallback((patch: Partial<DropdownState>) => {
    setDropdowns((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleCustomerDropdownOpen = useCallback(async () => {
    patchDropdowns({ customersLoading: true, error: '' });

    try {
      const customersResponse = await fetchCustomers();
      const customerData = Array.isArray(customersResponse)
        ? customersResponse
        : [];

      patchDropdowns({
        customers: customerData.map((c: CustomerApiResponse) => ({
          id: c.id,
          name: c.companyName,
          attn: c.attentionPoc,
          address: c.mailingAddress,
          city: c.city,
          phone: c.phone,
          email: c.email,
        })),
        customersLoaded: true,
      });
    } catch (error) {
      console.error(error);
      patchDropdowns({ error: 'Could not load saved customers.' });
    } finally {
      patchDropdowns({ customersLoading: false });
    }
  }, [patchDropdowns]);

  const handleShippingDropdownOpen = useCallback(async () => {
    patchDropdowns({ shippingLoading: true, error: '' });

    try {
      const shippingResponse = await fetchShipping();
      const shippingData = Array.isArray(shippingResponse)
        ? shippingResponse
        : [];

      patchDropdowns({
        shippingProfiles: shippingData.map((s: ShippingApiResponse) => ({
          id: s.id,
          name: s.warehouseName,
          attn: s.attentionTo,
          address: s.deliveryAddress,
          city: '',
          phone: s.phone,
        })),
        shippingLoaded: true,
      });
    } catch (error) {
      console.error(error);
      patchDropdowns({ error: 'Could not load saved warehouses.' });
    } finally {
      patchDropdowns({ shippingLoading: false });
    }
  }, [patchDropdowns]);

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
          bottleType: '',
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

  const handleShippingSelect = useCallback(
    (id: string) => {
      patchDropdowns({ selectedShippingId: id });

      if (!id) {
        setInvoiceData((prev) => ({
          ...prev,
          shipTo: {
            attn: '',
            name: '',
            address: '',
            city: '',
            phone: '',
          },
        }));
        return;
      }

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

  const handleCustomerSelect = useCallback(
    (id: string) => {
      patchDropdowns({ selectedCustomerId: id });

      if (!id) {
        setInvoiceData((prev) => ({
          ...prev,
          billTo: {
            attn: '',
            name: '',
            address: '',
            city: '',
            phone: '',
            email: '',
          },
        }));
        return;
      }

      const customer = dropdowns.customers.find(
        (customer) => customer.id.toString() === id
      );
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
    },
    [dropdowns.customers, patchDropdowns]
  );

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
      const payload = {
        invoiceNo: invoiceData.meta.invoiceNo,
        customerId: dropdowns.selectedCustomerId
          ? Number(dropdowns.selectedCustomerId)
          : undefined,
        customer: {
          companyName: invoiceData.billTo.name,
          attentionPoc: invoiceData.billTo.attn,
          mailingAddress: invoiceData.billTo.address,
          city: invoiceData.billTo.city,
          phone: invoiceData.billTo.phone,
          email: invoiceData.billTo.email,
        },
        shippingAddressId: dropdowns.selectedShippingId
          ? Number(dropdowns.selectedShippingId)
          : undefined,
        poNo: invoiceData.logisticInfo.poNo,
        shipVia: invoiceData.logisticInfo.shipVia,
        rep: invoiceData.logisticInfo.salesperson,
        fob: invoiceData.logisticInfo.fob,
        terms: invoiceData.logisticInfo.terms,
        dispatchDate: invoiceData.logisticInfo.shipDate,
        taxRate: invoiceData.taxRate,
        shippingCharges: invoiceData.shipping,
        miscCharges: invoiceData.other,
        previousDueArrears: invoiceData.previousDue,
        amountPaid: invoiceData.payment.paidAmount,
        subtotal,
        taxAmount,
        totalAmount,
        balanceDue,
        items: invoiceData.items.map((item, index) => ({
          itemCode: item.no,
          description: item.description,
          qty: item.qty,
          rate: item.unitPrice,
          sortOrder: index + 1,
        })),
      };

      const submitResponse = await submitInvoice(payload);
      if (
        submitResponse?.success === false ||
        submitResponse?.status >= 400 ||
        (submitResponse?.status === undefined &&
          submitResponse?.success === false)
      ) {
        throw new Error(submitResponse.message || 'Invoice submission failed.');
      }

      patchStatus({ successMessage: 'Invoice saved successfully!' });
      setInvoiceData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          invoiceNo: generateInvoiceNo(),
        },
      }));

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
        todayPrices={prices ?? []}
        onCustomerSelect={handleCustomerSelect}
        onShippingSelect={handleShippingSelect}
        onCustomerDropdownOpen={handleCustomerDropdownOpen}
        onShippingDropdownOpen={handleShippingDropdownOpen}
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

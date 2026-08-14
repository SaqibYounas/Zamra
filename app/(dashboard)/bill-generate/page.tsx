'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Badge } from '@/app/src/components/ui/Badge';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import InvoicePreviewModal from './components/InvoicePreviewModal';
import {
  InvoiceForm,
  LOGISTIC_FIELDS,
  FormStatus,
  DropdownState,
} from './components/InvoiceForm';
import { InvoiceData, ObjectSectionKey, InvoiceItem } from '../types/invoice';
import { fetchCustomers } from '../services/customers';
import { fetchShippingAddresses } from '../services/customers';
import { createInvoice } from '../services/invoices';
import { fetchActiveSellingPrices } from '../services/sellingPrices';
import { toNumber } from '@/app/src/lib/format';
import type { SellingPriceRecord } from '../types/prices';

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

/** Short, human-readable reference: ZAM- plus the last 6 digits of the clock. */
const generateInvoiceNo = () => `ZAM-${String(Date.now()).slice(-6)}`;

const blankItem = (id: number, index: number): InvoiceItem => ({
  id,
  no: String(index),
  description: '',
  bottleType: '',
  qty: 1,
  unitPrice: 0,
});

/**
 * A fresh invoice, empty apart from the plant's own details. The date and
 * invoice number are filled on mount; from the clock during render they'd differ.
 */
const initialInvoiceData: InvoiceData = {
  companyInfo: {
    name: 'Zamra Water Planet',
    address: '123 Main Street, Industrial Area',
    city: 'Lahore, Pakistan',
    phone: '+92 321 4567890',
    email: 'hello@zamrawater.com',
    poc: 'Sufyan Malik',
  },
  meta: { date: '', invoiceNo: '' },
  billTo: { attn: '', name: '', address: '', city: '', phone: '', email: '' },
  shipTo: { attn: '', name: '', address: '', city: '', phone: '' },
  logisticInfo: {
    poNo: '',
    shipDate: '',
    shipVia: '',
    salesperson: '',
    fob: '',
    terms: '',
  },
  items: [blankItem(1, 1)],
  previousDue: 0,
  payment: { paidAmount: 0 },
  taxRate: 0,
  shipping: 0,
  other: 0,
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

export default function InvoiceFormDashboard() {
  const [invoiceData, setInvoiceData] =
    useState<InvoiceData>(initialInvoiceData);
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [dropdowns, setDropdowns] = useState<DropdownState>(initialDropdowns);
  const [prices, setPrices] = useState<SellingPriceRecord[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const patchStatus = useCallback((patch: Partial<FormStatus>) => {
    setStatus((previous) => ({ ...previous, ...patch }));
  }, []);

  const patchDropdowns = useCallback((patch: Partial<DropdownState>) => {
    setDropdowns((previous) => ({ ...previous, ...patch }));
  }, []);

  // Clock-derived defaults, applied after hydration: computing them during
  // render would make the server and browser markup disagree.
  useEffect(() => {
    setInvoiceData((previous) => ({
      ...previous,
      meta: {
        date: previous.meta.date || todayISO(),
        invoiceNo: previous.meta.invoiceNo || generateInvoiceNo(),
      },
      logisticInfo: {
        ...previous.logisticInfo,
        shipDate: previous.logisticInfo.shipDate || todayISO(),
      },
    }));
  }, []);

  useEffect(() => {
    async function loadPrices() {
      try {
        const rates = await fetchActiveSellingPrices();
        setPrices(Array.isArray(rates) ? rates : []);
      } catch (error) {
        console.error(error);
      }
    }

    loadPrices();
  }, []);

  const handleCustomerDropdownOpen = useCallback(async () => {
    patchDropdowns({ customersLoading: true, error: '' });

    try {
      const customersResponse = await fetchCustomers();
      const customerData = Array.isArray(customersResponse)
        ? customersResponse
        : [];

      patchDropdowns({
        customers: customerData.map((customer: CustomerApiResponse) => ({
          id: customer.id,
          name: customer.companyName,
          attn: customer.attentionPoc,
          address: customer.mailingAddress,
          city: customer.city,
          phone: customer.phone,
          email: customer.email,
        })),
        customersLoaded: true,
      });
    } catch (error) {
      console.error(error);
      patchDropdowns({ error: 'Saved customers could not be loaded.' });
    } finally {
      patchDropdowns({ customersLoading: false });
    }
  }, [patchDropdowns]);

  const handleShippingDropdownOpen = useCallback(async () => {
    patchDropdowns({ shippingLoading: true, error: '' });

    try {
      const shippingResponse = await fetchShippingAddresses();
      const shippingData = Array.isArray(shippingResponse)
        ? shippingResponse
        : [];

      patchDropdowns({
        shippingProfiles: shippingData.map((profile: ShippingApiResponse) => ({
          id: profile.id,
          name: profile.warehouseName,
          attn: profile.attentionTo,
          address: profile.deliveryAddress,
          city: '',
          phone: profile.phone,
        })),
        shippingLoaded: true,
      });
    } catch (error) {
      console.error(error);
      patchDropdowns({ error: 'Saved warehouses could not be loaded.' });
    } finally {
      patchDropdowns({ shippingLoading: false });
    }
  }, [patchDropdowns]);

  const handleInputChange = useCallback(
    (section: ObjectSectionKey, field: string, value: string | number) => {
      setInvoiceData((previous) => ({
        ...previous,
        [section]: { ...previous[section], [field]: value },
      }));
    },
    []
  );

  const handleLedgerChange = useCallback(
    (
      field: 'taxRate' | 'shipping' | 'other' | 'previousDue',
      value: number
    ) => {
      setInvoiceData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const handleItemChange = useCallback(
    (
      id: number,
      field: keyof Omit<InvoiceItem, 'id'>,
      value: string | number
    ) => {
      setInvoiceData((previous) => ({
        ...previous,
        items: previous.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const addItem = useCallback(() => {
    setInvoiceData((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        blankItem(
          // Monotonic id that cannot collide with the seeded first row.
          Math.max(0, ...previous.items.map((item) => item.id)) + 1,
          previous.items.length + 1
        ),
      ],
    }));
  }, []);

  const removeItem = useCallback((id: number) => {
    setInvoiceData((previous) => ({
      ...previous,
      items: previous.items.filter((item) => item.id !== id),
    }));
  }, []);

  const handleShippingSelect = useCallback(
    (id: string) => {
      patchDropdowns({ selectedShippingId: id });

      if (!id) {
        setInvoiceData((previous) => ({
          ...previous,
          shipTo: { attn: '', name: '', address: '', city: '', phone: '' },
        }));
        return;
      }

      const profile = dropdowns.shippingProfiles.find(
        (entry) => entry.id.toString() === id
      );
      if (!profile) return;

      patchStatus({ isShippingSame: false });

      setInvoiceData((previous) => ({
        ...previous,
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
        setInvoiceData((previous) => ({
          ...previous,
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
        (entry) => entry.id.toString() === id
      );
      if (!customer) return;

      setInvoiceData((previous) => ({
        ...previous,
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

  // Mirror billing into shipping while the toggle is on.
  useEffect(() => {
    if (!status.isShippingSame) return;

    setInvoiceData((previous) => ({
      ...previous,
      shipTo: {
        attn: previous.billTo.attn,
        name: previous.billTo.name,
        address: previous.billTo.address,
        city: previous.billTo.city,
        phone: previous.billTo.phone,
      },
    }));
  }, [status.isShippingSame, invoiceData.billTo]);

  const totals = useMemo(() => {
    const subtotal = invoiceData.items.reduce(
      (sum, item) => sum + toNumber(item.qty) * toNumber(item.unitPrice),
      0
    );
    const taxAmount = (subtotal * toNumber(invoiceData.taxRate)) / 100;
    const totalAmount =
      subtotal +
      taxAmount +
      toNumber(invoiceData.shipping) +
      toNumber(invoiceData.other) +
      toNumber(invoiceData.previousDue);

    return {
      subtotal,
      taxAmount,
      totalAmount,
      balanceDue: Math.max(
        0,
        totalAmount - toNumber(invoiceData.payment.paidAmount)
      ),
    };
  }, [invoiceData]);

  /**
   * Checks the form and reports what is missing. Separate from submission so the
   * preview runs the same checks.
   */
  const validate = (): boolean => {
    patchStatus({ error: '', successMessage: '' });

    const localErrors: Record<string, string> = {};

    if (!invoiceData.meta.invoiceNo)
      localErrors.invoiceNo = 'Invoice number is required.';
    if (!invoiceData.billTo.name)
      localErrors.name = 'Company name is required.';
    if (!invoiceData.billTo.phone) localErrors.phone = 'Phone is required.';
    if (!invoiceData.billTo.address)
      localErrors.address = 'Mailing address is required.';
    if (!invoiceData.billTo.city) localErrors.city = 'City is required.';
    if (!invoiceData.billTo.email) localErrors.email = 'Email is required.';

    if (Object.keys(localErrors).length > 0) {
      patchStatus({
        fieldErrors: localErrors,
        error: 'Please complete the highlighted fields.',
      });

      const firstField = Object.keys(localErrors)[0];
      setTimeout(() => {
        const input = document.querySelector(
          `input[name="${firstField}"]`
        ) as HTMLInputElement | null;
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input?.focus();
      }, 100);
      return false;
    }

    const billableItems = invoiceData.items.filter(
      (item) => item.description.trim() && toNumber(item.qty) > 0
    );

    if (billableItems.length === 0) {
      patchStatus({
        error:
          'Add at least one line item with a description and a quantity above zero.',
      });
      return false;
    }

    patchStatus({ fieldErrors: {} });
    return true;
  };

  /** Opens the preview, but only once the invoice would actually be savable. */
  const handlePreview = () => {
    if (validate()) setPreviewOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) void saveAndDownload();
  };

  const saveAndDownload = async () => {
    if (typeof window === 'undefined') return;

    patchStatus({ isPrinting: true });

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
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        balanceDue: totals.balanceDue,
        items: invoiceData.items.map((item, index) => ({
          itemCode: item.no,
          description: item.description,
          bottleType: item.bottleType,
          qty: toNumber(item.qty),
          rate: toNumber(item.unitPrice),
          sortOrder: index + 1,
        })),
      };

      const submitResponse = await createInvoice(payload);

      if (!submitResponse.success) {
        throw new Error(submitResponse.message || 'Invoice submission failed.');
      }

      patchStatus({ successMessage: 'Invoice saved. Preparing your PDF…' });

      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas-pro'),
      ]);

      const source = document.getElementById('invoice-doc');
      if (!source) {
        patchStatus({
          error: 'The invoice layout could not be found for export.',
          isPrinting: false,
        });
        return;
      }

      // Render an off-screen clone at a fixed A4-ish width so the PDF is not
      // affected by the current viewport size.
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
      } finally {
        // Always clean up the off-screen host, even if rendering threw.
        document.body.removeChild(host);
      }

      patchStatus({
        successMessage: `Invoice ${invoiceData.meta.invoiceNo} saved and downloaded.`,
      });

      setPreviewOpen(false);

      // Start the next invoice with a fresh number.
      setInvoiceData((previous) => ({
        ...previous,
        meta: { ...previous.meta, invoiceNo: generateInvoiceNo() },
      }));
    } catch (error) {
      console.error(error);
      patchStatus({
        error:
          (error as Error)?.message ||
          'The invoice could not be saved or exported.',
      });
    } finally {
      patchStatus({ isPrinting: false });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Billing"
        title="New invoice"
        description="Build a customer invoice from live selling prices, save it to your records and download a PDF copy."
        meta={
          <>
            {invoiceData.meta.invoiceNo ? (
              <Badge tone="brand">#{invoiceData.meta.invoiceNo}</Badge>
            ) : null}
            <Badge tone="neutral">
              {prices.length > 0
                ? `${prices.length} active rate${prices.length === 1 ? '' : 's'} available`
                : 'No active selling rates found'}
            </Badge>
          </>
        }
      />

      <InvoiceForm
        invoiceData={invoiceData}
        status={status}
        dropdowns={dropdowns}
        totals={totals}
        onShippingSameToggle={() =>
          patchStatus({ isShippingSame: !status.isShippingSame })
        }
        todayPrices={prices}
        onCustomerSelect={handleCustomerSelect}
        onShippingSelect={handleShippingSelect}
        onCustomerDropdownOpen={handleCustomerDropdownOpen}
        onShippingDropdownOpen={handleShippingDropdownOpen}
        onInputChange={handleInputChange}
        onItemChange={handleItemChange}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onLedgerChange={handleLedgerChange}
        onSubmit={handleSubmit}
        onPreview={handlePreview}
      />

      <InvoicePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={() => void saveAndDownload()}
        submitting={status.isPrinting}
        invoiceData={invoiceData}
        logisticFields={LOGISTIC_FIELDS}
        subtotal={totals.subtotal}
        taxAmount={totals.taxAmount}
        totalAmount={totals.totalAmount}
        balanceDue={totals.balanceDue}
      />

      {/* Print template: rendered off-screen and cloned for the PDF export.
          This is the copy that owns the `invoice-doc` id. */}
      <div className="hidden" aria-hidden>
        <InvoiceTemplate
          domId="invoice-doc"
          invoiceData={invoiceData}
          logisticFields={LOGISTIC_FIELDS}
          subtotal={totals.subtotal}
          taxAmount={totals.taxAmount}
          totalAmount={totals.totalAmount}
          balanceDue={totals.balanceDue}
        />
      </div>
    </PageContainer>
  );
}

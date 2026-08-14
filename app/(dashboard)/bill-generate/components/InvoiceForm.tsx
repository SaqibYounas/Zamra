'use client';

import React from 'react';
import {
  Building2,
  Calendar,
  Eye,
  Hash,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plus,
  Receipt,
  Trash2,
  Truck,
  User,
} from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { FieldsetHeading } from '@/app/src/components/ui/FieldsetHeading';
import { Alert } from '@/app/src/components/ui/Alert';
import { Badge } from '@/app/src/components/ui/Badge';
import TextField from '@/app/src/components/ui/TextField';
import Button, { IconButton } from '@/app/src/components/ui/Button';
import Dropdown from '@/app/src/components/ui/Dropdown';
import { formatMoneyExact, toNumber } from '@/app/src/lib/format';

import {
  InvoiceData,
  ObjectSectionKey,
  InvoiceItem,
} from '../../types/invoice';
import { BOTTLE_TYPE_OPTIONS } from '../../data/bottleTypes';
import type { SellingPriceRecord } from '../../types/prices';

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

export interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  balanceDue: number;
}

export const LOGISTIC_FIELDS = [
  { key: 'poNo', label: 'P.O. number', placeholder: 'e.g. PO-998' },
  { key: 'shipVia', label: 'Ship via', placeholder: 'e.g. Company van' },
  { key: 'salesperson', label: 'Sales rep', placeholder: 'e.g. Admin' },
  { key: 'fob', label: 'F.O.B.', placeholder: 'e.g. Destination' },
  { key: 'terms', label: 'Terms', placeholder: 'e.g. Net 30' },
];

const LEDGER_FIELDS = [
  {
    key: 'taxRate' as const,
    label: 'Tax',
    suffix: '%',
    prefix: undefined as string | undefined,
  },
  { key: 'shipping' as const, label: 'Shipping', prefix: 'Rs' },
  { key: 'other' as const, label: 'Misc charges', prefix: 'Rs' },
  { key: 'previousDue' as const, label: 'Previous due', prefix: 'Rs' },
];

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  status: FormStatus;
  dropdowns: DropdownState;
  totals: InvoiceTotals;
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
  /** Validates, then opens the preview dialog. */
  onPreview: () => void;
  todayPrices: SellingPriceRecord[];
}

/**
 * Invoice builder. Two columns from `xl` with a sticky totals panel, so the
 * balance due stays visible while line items are edited.
 */
export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  status,
  dropdowns,
  totals,
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
  onPreview,
  todayPrices,
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

  const ensureCustomers = () => {
    if (!customersLoaded && !customersLoading) onCustomerDropdownOpen();
  };

  const ensureShipping = () => {
    if (!shippingLoaded && !shippingLoading) onShippingDropdownOpen();
  };

  /**
   * Picking a size fills in the matching rate, and seeds the description only
   * when still empty — overwriting typed text produced wrong saved invoices.
   */
  const applyBottleType = (item: InvoiceItem, bottleType: string) => {
    onItemChange(item.id, 'bottleType', bottleType);

    const match = todayPrices.find(
      (price) => price.priceManagement?.bottleType === bottleType
    );

    if (match) {
      onItemChange(item.id, 'unitPrice', toNumber(match.sellingPrice));
    }

    if (!item.description.trim()) {
      onItemChange(item.id, 'description', bottleType);
    }
  };

  const applyUnitPrice = (item: InvoiceItem, value: string) => {
    onItemChange(item.id, 'unitPrice', toNumber(value));

    const match = todayPrices.find(
      (price) => String(price.sellingPrice) === value
    );
    const matchedType = match?.priceManagement?.bottleType;

    if (matchedType) applyBottleType(item, matchedType);
  };

  const priceOptionsFor = (bottleType: string) =>
    todayPrices
      .filter((price) =>
        bottleType ? price.priceManagement?.bottleType === bottleType : false
      )
      .map((price) => ({
        label: formatMoneyExact(price.sellingPrice),
        value: String(price.sellingPrice),
      }));

  const canRemoveItems = invoiceData.items.length > 1;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {dropdownError ? <Alert tone="warning">{dropdownError}</Alert> : null}
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {successMessage ? <Alert tone="success">{successMessage}</Alert> : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        {/* ---------------------------------------------------------- main */}
        <div className="min-w-0 space-y-4">
          {/* Invoice meta */}
          <Card as="section">
            <CardHeader
              title="Invoice details"
              description="Reference number and issue date"
              icon={<Receipt className="size-4" />}
            />
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                name="invoiceNo"
                label="Invoice number"
                icon={Hash}
                type="text"
                value={invoiceData.meta.invoiceNo}
                onChange={(event) =>
                  onInputChange('meta', 'invoiceNo', event.target.value)
                }
                placeholder="ZAM-000123"
                error={fieldErrors.invoiceNo}
                required
              />

              <TextField
                name="invoiceDate"
                label="Invoice date"
                icon={Calendar}
                type="date"
                value={invoiceData.meta.date}
                onChange={(event) =>
                  onInputChange('meta', 'date', event.target.value)
                }
              />
            </CardBody>
          </Card>

          {/* Bill to */}
          <Card as="section">
            <CardBody className="space-y-4">
              <FieldsetHeading
                title="Bill to"
                description="Who the invoice is addressed to"
                icon={<User className="size-3.5" />}
                actions={
                  <div
                    className="w-full sm:w-52"
                    onPointerDown={ensureCustomers}
                    onFocus={ensureCustomers}
                  >
                    <Dropdown
                      name="savedCustomer"
                      placeholder="Load saved customer"
                      options={customers.map((customer) => ({
                        label: customer.name,
                        value: customer.id.toString(),
                        meta: customer.city,
                      }))}
                      value={selectedCustomerId}
                      onChange={(value) =>
                        onCustomerSelect(
                          value === selectedCustomerId ? '' : value
                        )
                      }
                      loading={customersLoading}
                      emptyMessage="No saved customers"
                    />
                  </div>
                }
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField
                    name="name"
                    label="Company name"
                    icon={Building2}
                    type="text"
                    value={invoiceData.billTo.name}
                    onChange={(event) =>
                      onInputChange('billTo', 'name', event.target.value)
                    }
                    placeholder="Customer company"
                    error={fieldErrors.name}
                    required
                  />
                </div>

                <TextField
                  name="attn"
                  label="Attention / POC"
                  icon={User}
                  type="text"
                  value={invoiceData.billTo.attn}
                  onChange={(event) =>
                    onInputChange('billTo', 'attn', event.target.value)
                  }
                  placeholder="Accounts department"
                />

                <TextField
                  name="phone"
                  label="Phone"
                  icon={Phone}
                  type="tel"
                  inputMode="tel"
                  value={invoiceData.billTo.phone}
                  onChange={(event) =>
                    onInputChange('billTo', 'phone', event.target.value)
                  }
                  placeholder="042-0000000"
                  error={fieldErrors.phone}
                  required
                />

                <div className="sm:col-span-2">
                  <TextField
                    name="address"
                    label="Mailing address"
                    icon={MapPin}
                    type="text"
                    value={invoiceData.billTo.address}
                    onChange={(event) =>
                      onInputChange('billTo', 'address', event.target.value)
                    }
                    placeholder="Street and area"
                    error={fieldErrors.address}
                    required
                  />
                </div>

                <TextField
                  name="city"
                  label="City"
                  icon={MapPin}
                  type="text"
                  value={invoiceData.billTo.city}
                  onChange={(event) =>
                    onInputChange('billTo', 'city', event.target.value)
                  }
                  placeholder="City"
                  error={fieldErrors.city}
                  required
                />

                <TextField
                  name="email"
                  label="Email"
                  icon={Mail}
                  type="email"
                  inputMode="email"
                  value={invoiceData.billTo.email}
                  onChange={(event) =>
                    onInputChange('billTo', 'email', event.target.value)
                  }
                  placeholder="billing@customer.com"
                  error={fieldErrors.email}
                  required
                />
              </div>
            </CardBody>
          </Card>

          {/* Ship to */}
          <Card as="section">
            <CardBody className="space-y-4">
              <FieldsetHeading
                title="Ship to"
                description="Where the water is delivered"
                icon={<Truck className="size-3.5" />}
                actions={
                  <div
                    className="w-full sm:w-52"
                    onPointerDown={ensureShipping}
                    onFocus={ensureShipping}
                  >
                    <Dropdown
                      name="savedShipping"
                      placeholder="Load saved warehouse"
                      options={shippingProfiles.map((profile) => ({
                        label: profile.name,
                        value: profile.id.toString(),
                      }))}
                      value={selectedShippingId}
                      onChange={(value) =>
                        onShippingSelect(
                          value === selectedShippingId ? '' : value
                        )
                      }
                      loading={shippingLoading}
                      emptyMessage="No saved warehouses"
                    />
                  </div>
                }
              />

              {/* Restores the "same as billing" behaviour the state already
                  tracked but never exposed a control for. */}
              <label className="flex w-fit cursor-pointer items-center gap-2.5 rounded-field border border-line bg-surface-sunken px-3 py-2">
                <input
                  type="checkbox"
                  checked={isShippingSame}
                  onChange={onShippingSameToggle}
                  className="size-4 accent-brand-600"
                />
                <span className="text-xs font-medium text-ink-soft">
                  Same as billing address
                </span>
              </label>

              {isShippingSame ? (
                <Alert tone="info">
                  Shipping details will mirror the billing address above.
                </Alert>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <TextField
                      name="shipName"
                      label="Warehouse name"
                      icon={Building2}
                      type="text"
                      value={invoiceData.shipTo.name}
                      onChange={(event) =>
                        onInputChange('shipTo', 'name', event.target.value)
                      }
                      placeholder="Customer warehouse"
                    />
                  </div>

                  <TextField
                    name="shipAttn"
                    label="Attention to"
                    icon={User}
                    type="text"
                    value={invoiceData.shipTo.attn}
                    onChange={(event) =>
                      onInputChange('shipTo', 'attn', event.target.value)
                    }
                    placeholder="Store manager"
                  />

                  <TextField
                    name="shipPhone"
                    label="Phone"
                    icon={Phone}
                    type="tel"
                    inputMode="tel"
                    value={invoiceData.shipTo.phone}
                    onChange={(event) =>
                      onInputChange('shipTo', 'phone', event.target.value)
                    }
                    placeholder="042-0000000"
                  />

                  <div className="sm:col-span-2">
                    <TextField
                      name="shipAddress"
                      label="Delivery address"
                      icon={MapPin}
                      type="text"
                      value={invoiceData.shipTo.address}
                      onChange={(event) =>
                        onInputChange('shipTo', 'address', event.target.value)
                      }
                      placeholder="Plot, street and area"
                    />
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Logistics */}
          <Card as="section">
            <CardBody className="space-y-4">
              <FieldsetHeading
                title="Logistics"
                description="Dispatch and payment terms printed on the invoice"
                icon={<Truck className="size-3.5" />}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LOGISTIC_FIELDS.map((field) => (
                  <TextField
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    type="text"
                    value={
                      invoiceData.logisticInfo[
                        field.key as keyof typeof invoiceData.logisticInfo
                      ]
                    }
                    onChange={(event) =>
                      onInputChange(
                        'logisticInfo',
                        field.key,
                        event.target.value
                      )
                    }
                    placeholder={field.placeholder}
                  />
                ))}

                <TextField
                  name="shipDate"
                  label="Dispatch date"
                  icon={Calendar}
                  type="date"
                  value={invoiceData.logisticInfo.shipDate}
                  onChange={(event) =>
                    onInputChange(
                      'logisticInfo',
                      'shipDate',
                      event.target.value
                    )
                  }
                />
              </div>
            </CardBody>
          </Card>

          {/* Line items */}
          <Card as="section">
            <CardHeader
              title="Line items"
              description="Quantities and rates for this delivery"
              icon={<Receipt className="size-4" />}
              metric={
                <Badge tone="neutral">
                  {invoiceData.items.length}{' '}
                  {invoiceData.items.length === 1 ? 'item' : 'items'}
                </Badge>
              }
              actions={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  label="Add item"
                  icon={<Plus className="size-3.5" />}
                  onClick={onAddItem}
                />
              }
            />

            <CardBody className="space-y-3">
              {invoiceData.items.length === 0 ? (
                <Alert tone="warning">
                  Add at least one line item before saving the invoice.
                </Alert>
              ) : (
                invoiceData.items.map((item, index) => {
                  const lineTotal =
                    toNumber(item.qty) * toNumber(item.unitPrice);

                  return (
                    <div
                      key={item.id}
                      className="rounded-card border border-line bg-surface-sunken/40 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">
                          Item {index + 1}
                        </span>

                        <IconButton
                          variant="ghost"
                          size="sm"
                          label={`Remove item ${index + 1}`}
                          icon={<Trash2 className="size-3.5" />}
                          onClick={() => onRemoveItem(Number(item.id))}
                          disabled={!canRemoveItems}
                          className="text-danger hover:bg-danger-soft"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 lg:grid-cols-12">
                        <div className="col-span-2 lg:col-span-1">
                          <TextField
                            name={`itemNo-${item.id}`}
                            label="Code"
                            type="text"
                            value={item.no}
                            onChange={(event) =>
                              onItemChange(item.id, 'no', event.target.value)
                            }
                          />
                        </div>

                        <div className="col-span-2 lg:col-span-4">
                          <TextField
                            name={`itemDescription-${item.id}`}
                            label="Description"
                            type="text"
                            value={item.description}
                            onChange={(event) =>
                              onItemChange(
                                item.id,
                                'description',
                                event.target.value
                              )
                            }
                            placeholder="500ml premium bottle (box of 12)"
                          />
                        </div>

                        <div className="lg:col-span-2">
                          <Dropdown
                            name={`itemBottle-${item.id}`}
                            label="Bottle size"
                            options={BOTTLE_TYPE_OPTIONS}
                            value={item.bottleType}
                            onChange={(value) => applyBottleType(item, value)}
                            placeholder="Select"
                          />
                        </div>

                        <div className="lg:col-span-1">
                          <TextField
                            name={`itemQty-${item.id}`}
                            label="Qty"
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={String(item.qty)}
                            onChange={(event) =>
                              onItemChange(item.id, 'qty', event.target.value)
                            }
                          />
                        </div>

                        <div className="lg:col-span-2">
                          <Dropdown
                            name={`itemRate-${item.id}`}
                            label="Rate"
                            placeholder={
                              item.bottleType ? 'Select rate' : 'Pick a size'
                            }
                            options={priceOptionsFor(item.bottleType)}
                            value={String(item.unitPrice)}
                            onChange={(value) => applyUnitPrice(item, value)}
                            emptyMessage="No active rate for this size"
                          />
                        </div>

                        <div className="col-span-2 lg:col-span-2">
                          <p className="field-label mb-1.5">Amount</p>
                          <div className="field-shell" data-disabled="true">
                            <span className="tabular field-input py-0 font-semibold text-ink">
                              {formatMoneyExact(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardBody>
          </Card>

          {/* Ledger */}
          <Card as="section">
            <CardBody className="space-y-4">
              <FieldsetHeading
                title="Adjustments"
                description="Tax, charges and amounts already settled"
                icon={<Percent className="size-3.5" />}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LEDGER_FIELDS.map((field) => (
                  <TextField
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    prefix={field.prefix}
                    suffix={field.suffix}
                    value={String(invoiceData[field.key])}
                    onChange={(event) =>
                      onLedgerChange(field.key, toNumber(event.target.value))
                    }
                  />
                ))}

                <TextField
                  name="paidAmount"
                  label="Amount paid"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  prefix="Rs"
                  value={String(invoiceData.payment.paidAmount)}
                  onChange={(event) =>
                    onInputChange(
                      'payment',
                      'paidAmount',
                      toNumber(event.target.value)
                    )
                  }
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ------------------------------------------------------- summary */}
        <aside className="min-w-0">
          <div className="xl:sticky xl:top-20">
            <Card>
              <CardHeader
                title="Summary"
                description="Recalculated as you type"
                icon={<Receipt className="size-4" />}
              />

              <CardBody className="space-y-2.5">
                <SummaryRow
                  label="Subtotal"
                  value={formatMoneyExact(totals.subtotal)}
                />
                <SummaryRow
                  label={`Tax (${invoiceData.taxRate || 0}%)`}
                  value={formatMoneyExact(totals.taxAmount)}
                />
                <SummaryRow
                  label="Shipping"
                  value={formatMoneyExact(invoiceData.shipping)}
                />
                <SummaryRow
                  label="Misc charges"
                  value={formatMoneyExact(invoiceData.other)}
                />
                <SummaryRow
                  label="Previous due"
                  value={formatMoneyExact(invoiceData.previousDue)}
                  tone="danger"
                />
                <SummaryRow
                  label="Amount paid"
                  value={formatMoneyExact(invoiceData.payment.paidAmount)}
                  tone="success"
                />

                <div className="flex items-baseline justify-between gap-2 border-t border-line pt-2.5">
                  <span className="text-xs font-semibold text-ink-soft">
                    Invoice total
                  </span>
                  <span className="tabular text-sm font-semibold text-ink">
                    {formatMoneyExact(totals.totalAmount)}
                  </span>
                </div>

                <div className="rounded-field bg-marine-950 px-3.5 py-3 text-ink-invert">
                  <p className="text-2xs font-semibold uppercase tracking-wide text-marine-300">
                    Balance due
                  </p>
                  <p className="tabular mt-0.5 text-xl font-semibold">
                    {formatMoneyExact(totals.balanceDue)}
                  </p>
                </div>

                <Button
                  type="button"
                  fullWidth
                  size="lg"
                  label="Preview invoice"
                  onClick={onPreview}
                  disabled={isPrinting}
                  icon={<Eye className="size-4" />}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="secondary"
                  label="Save & download PDF"
                  loadingLabel="Building invoice…"
                  loading={isPrinting}
                  icon={<Receipt className="size-4" />}
                />

                <p className="text-center text-2xs leading-relaxed text-ink-faint">
                  Preview first to check the document, or save straight away.
                  The invoice is stored in your records, then downloaded as a
                  PDF.
                </p>
              </CardBody>
            </Card>
          </div>
        </aside>
      </div>
    </form>
  );
};

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'danger' | 'success';
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs text-ink-muted">{label}</span>
      <span
        className={`tabular text-xs font-medium ${
          tone === 'danger'
            ? 'text-danger-ink'
            : tone === 'success'
              ? 'text-success-ink'
              : 'text-ink-soft'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

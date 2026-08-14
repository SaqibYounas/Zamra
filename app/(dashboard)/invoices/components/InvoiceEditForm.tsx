'use client';

import { useMemo, useState } from 'react';
import {
  Building2,
  CalendarDays,
  Hash,
  Percent,
  Plus,
  Receipt,
  Save,
  Trash2,
  Truck,
  User,
  Wallet,
} from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { Alert } from '@/app/src/components/ui/Alert';
import Button, { IconButton } from '@/app/src/components/ui/Button';
import TextField from '@/app/src/components/ui/TextField';
import Dropdown from '@/app/src/components/ui/Dropdown';
import { EmptyState } from '@/app/src/components/ui/StatePlaceholders';
import { formatMoneyExact, toNumber } from '@/app/src/lib/format';

import { BOTTLE_TYPE_OPTIONS } from '../../data/bottleTypes';
import { updateInvoice } from '../../services/invoices';
import type {
  InvoiceLineRecord,
  InvoiceRecord,
  InvoiceStatus,
  InvoiceUpdateInput,
} from '../../types/invoice';
import { INVOICE_STATUSES } from './statusTone';

interface Props {
  invoice: InvoiceRecord;
  /** Runs after a successful save, before the caller navigates away. */
  onSaved: () => void;
  onCancel: () => void;
}

/** Line rows carry a local key so React can track them across add/remove. */
interface EditableLine extends InvoiceLineRecord {
  key: string;
}

const STATUS_OPTIONS = INVOICE_STATUSES.map((status) => ({
  label: status,
  value: status,
}));

const digitsOnly = (value: string) => value.replace(/[^0-9]/g, '');
const decimalOnly = (value: string) => value.replace(/[^0-9.]/g, '');

/** Prefilled edit form for a saved invoice. */
export default function InvoiceEditForm({ invoice, onSaved, onCancel }: Props) {
  const [invoiceNo, setInvoiceNo] = useState(invoice.invoiceNo ?? '');
  const [date, setDate] = useState(invoice.date ?? '');
  const [customer, setCustomer] = useState(invoice.customer ?? '');
  const [status, setStatus] = useState<InvoiceStatus>(
    invoice.status ?? 'Pending'
  );
  const [poNo, setPoNo] = useState(invoice.poNo ?? '');
  const [shipVia, setShipVia] = useState(invoice.shipVia ?? '');
  const [rep, setRep] = useState(invoice.rep ?? '');
  const [terms, setTerms] = useState(invoice.terms ?? '');
  const [taxRate, setTaxRate] = useState(String(invoice.taxRate ?? ''));
  const [shippingCharges, setShippingCharges] = useState(
    String(invoice.shippingCharges ?? '')
  );
  const [miscCharges, setMiscCharges] = useState(
    String(invoice.miscCharges ?? '')
  );
  const [previousDue, setPreviousDue] = useState(
    String(invoice.previousDueArrears ?? '')
  );
  const [amountPaid, setAmountPaid] = useState(
    String(invoice.amountPaid ?? '')
  );

  const [lines, setLines] = useState<EditableLine[]>(() =>
    (invoice.items ?? []).map((item, index) => ({
      ...item,
      key: String(item.id ?? `line-${index}`),
    }))
  );

  // Monotonic, so a removed row's key is never handed to a new one.
  const [nextLineKey, setNextLineKey] = useState(1);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, line) => sum + toNumber(line.qty) * toNumber(line.rate),
      0
    );
    const taxAmount = (subtotal * toNumber(taxRate)) / 100;
    const total =
      subtotal +
      taxAmount +
      toNumber(shippingCharges) +
      toNumber(miscCharges) +
      toNumber(previousDue);

    return {
      subtotal,
      taxAmount,
      total,
      balanceDue: total - toNumber(amountPaid),
    };
  }, [lines, taxRate, shippingCharges, miscCharges, previousDue, amountPaid]);

  const patchLine = (key: string, patch: Partial<EditableLine>) => {
    setLines((previous) =>
      previous.map((line) => (line.key === key ? { ...line, ...patch } : line))
    );
    setFormError('');
  };

  const addLine = () => {
    setLines((previous) => [
      ...previous,
      {
        key: `new-${nextLineKey}`,
        itemCode: '',
        description: '',
        bottleType: '',
        qty: 1,
        rate: 0,
      },
    ]);
    setNextLineKey((current) => current + 1);
  };

  const removeLine = (key: string) => {
    setLines((previous) => previous.filter((line) => line.key !== key));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: Record<string, string> = {};
    if (!invoiceNo.trim()) errors.invoiceNo = 'An invoice number is required.';
    if (!date.trim()) errors.date = 'An invoice date is required.';
    if (!customer.trim()) errors.customer = 'A customer name is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (lines.length === 0) {
      setFormError('An invoice needs at least one line item.');
      return;
    }

    setSaving(true);
    setFieldErrors({});
    setFormError('');

    const payload: InvoiceUpdateInput = {
      invoiceNo: invoiceNo.trim(),
      date,
      customer: customer.trim(),
      status,
      poNo: poNo.trim(),
      shipVia: shipVia.trim(),
      rep: rep.trim(),
      terms: terms.trim(),
      taxRate: toNumber(taxRate),
      shippingCharges: toNumber(shippingCharges),
      miscCharges: toNumber(miscCharges),
      previousDueArrears: toNumber(previousDue),
      amountPaid: toNumber(amountPaid),
      // Built field by field so the local row key is not sent to the backend.
      items: lines.map((line) => ({
        id: line.id,
        itemCode: line.itemCode,
        description: line.description,
        bottleType: line.bottleType,
        qty: toNumber(line.qty),
        rate: toNumber(line.rate),
      })),
    };

    const response = await updateInvoice(invoice.id, payload);

    setSaving(false);

    if (response?.success === false) {
      setFormError(response.message || 'The invoice could not be updated.');
      return;
    }

    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError ? <Alert tone="danger">{formError}</Alert> : null}

      <Card as="section">
        <CardHeader
          title="Invoice details"
          description="Identity, customer and settlement state"
          icon={<Receipt className="size-4" />}
        />

        <CardBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              name="invoiceNo"
              label="Invoice number"
              icon={Hash}
              type="text"
              value={invoiceNo}
              onChange={(event) => {
                setInvoiceNo(event.target.value);
                setFieldErrors((p) => ({ ...p, invoiceNo: '' }));
              }}
              error={fieldErrors.invoiceNo}
              required
            />

            <TextField
              name="date"
              label="Invoice date"
              icon={CalendarDays}
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setFieldErrors((p) => ({ ...p, date: '' }));
              }}
              error={fieldErrors.date}
              required
            />

            <Dropdown
              name="status"
              label="Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(value) => setStatus(value as InvoiceStatus)}
              required
            />

            <div className="sm:col-span-2">
              <TextField
                name="customer"
                label="Customer"
                icon={Building2}
                type="text"
                value={customer}
                onChange={(event) => {
                  setCustomer(event.target.value);
                  setFieldErrors((p) => ({ ...p, customer: '' }));
                }}
                error={fieldErrors.customer}
                required
              />
            </div>

            <TextField
              name="poNo"
              label="PO number"
              icon={Hash}
              type="text"
              value={poNo}
              onChange={(event) => setPoNo(event.target.value)}
            />

            <TextField
              name="shipVia"
              label="Ship via"
              icon={Truck}
              type="text"
              value={shipVia}
              onChange={(event) => setShipVia(event.target.value)}
            />

            <TextField
              name="rep"
              label="Representative"
              icon={User}
              type="text"
              value={rep}
              onChange={(event) => setRep(event.target.value)}
            />

            <TextField
              name="terms"
              label="Terms"
              icon={Receipt}
              type="text"
              value={terms}
              onChange={(event) => setTerms(event.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      <Card as="section">
        <CardHeader
          title="Line items"
          description="What was supplied, and at what rate"
          icon={<Wallet className="size-4" />}
          actions={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              label="Add item"
              icon={<Plus className="size-3.5" />}
              onClick={addLine}
            />
          }
        />

        <CardBody className="space-y-3">
          {lines.length === 0 ? (
            <EmptyState
              title="No line items"
              description="Add at least one item before saving this invoice."
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  label="Add item"
                  icon={<Plus className="size-3.5" />}
                  onClick={addLine}
                />
              }
            />
          ) : (
            lines.map((line, index) => (
              <div
                key={line.key}
                className="rounded-field border border-line bg-surface-sunken/40 p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">
                    Item {index + 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="tabular text-sm font-semibold text-ink">
                      {formatMoneyExact(
                        toNumber(line.qty) * toNumber(line.rate)
                      )}
                    </span>
                    <IconButton
                      variant="secondary"
                      size="sm"
                      label={`Remove item ${index + 1}`}
                      icon={<Trash2 className="size-3.5" />}
                      onClick={() => removeLine(line.key)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <TextField
                    name={`itemCode-${line.key}`}
                    label="Item code"
                    type="text"
                    value={line.itemCode ?? ''}
                    onChange={(event) =>
                      patchLine(line.key, { itemCode: event.target.value })
                    }
                  />

                  <div className="lg:col-span-2">
                    <TextField
                      name={`description-${line.key}`}
                      label="Description"
                      type="text"
                      value={line.description ?? ''}
                      onChange={(event) =>
                        patchLine(line.key, { description: event.target.value })
                      }
                    />
                  </div>

                  <Dropdown
                    name={`bottleType-${line.key}`}
                    label="Bottle size"
                    options={BOTTLE_TYPE_OPTIONS}
                    value={line.bottleType ?? ''}
                    onChange={(value) =>
                      patchLine(line.key, { bottleType: value })
                    }
                    placeholder="Select size"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      name={`qty-${line.key}`}
                      label="Qty"
                      type="text"
                      inputMode="numeric"
                      value={String(line.qty ?? '')}
                      onChange={(event) =>
                        patchLine(line.key, {
                          qty: toNumber(digitsOnly(event.target.value)),
                        })
                      }
                    />
                    <TextField
                      name={`rate-${line.key}`}
                      label="Rate"
                      prefix="Rs"
                      type="text"
                      inputMode="numeric"
                      value={String(line.rate ?? '')}
                      onChange={(event) =>
                        patchLine(line.key, {
                          rate: toNumber(digitsOnly(event.target.value)),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Card as="section">
        <CardHeader
          title="Charges and settlement"
          description="Tax, extras and what has been paid"
          icon={<Percent className="size-4" />}
        />

        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              name="taxRate"
              label="Tax rate"
              suffix="%"
              type="text"
              inputMode="decimal"
              value={taxRate}
              onChange={(event) => setTaxRate(decimalOnly(event.target.value))}
            />
            <TextField
              name="shippingCharges"
              label="Shipping"
              prefix="Rs"
              type="text"
              inputMode="numeric"
              value={shippingCharges}
              onChange={(event) =>
                setShippingCharges(digitsOnly(event.target.value))
              }
            />
            <TextField
              name="miscCharges"
              label="Other charges"
              prefix="Rs"
              type="text"
              inputMode="numeric"
              value={miscCharges}
              onChange={(event) =>
                setMiscCharges(digitsOnly(event.target.value))
              }
            />
            <TextField
              name="previousDueArrears"
              label="Previous arrears"
              prefix="Rs"
              type="text"
              inputMode="numeric"
              value={previousDue}
              onChange={(event) =>
                setPreviousDue(digitsOnly(event.target.value))
              }
            />
            <TextField
              name="amountPaid"
              label="Amount paid"
              prefix="Rs"
              type="text"
              inputMode="numeric"
              value={amountPaid}
              onChange={(event) =>
                setAmountPaid(digitsOnly(event.target.value))
              }
            />
          </div>

          <div className="flex justify-end">
            <div className="w-full space-y-2 rounded-field border border-line bg-surface-sunken/50 p-4 sm:max-w-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-ink-muted">Subtotal</span>
                <span className="tabular text-sm font-medium text-ink-soft">
                  {formatMoneyExact(totals.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-ink-muted">Tax</span>
                <span className="tabular text-sm font-medium text-ink-soft">
                  {formatMoneyExact(totals.taxAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-line pt-2.5">
                <span className="text-sm font-semibold text-ink">
                  Balance due
                </span>
                <span className="tabular text-lg font-semibold text-ink">
                  {formatMoneyExact(totals.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          label="Cancel"
          onClick={onCancel}
          disabled={saving}
          className="sm:w-auto"
          fullWidth
        />
        <Button
          type="submit"
          label="Save invoice"
          loadingLabel="Saving…"
          loading={saving}
          icon={<Save className="size-4" />}
          className="sm:w-auto"
          fullWidth
        />
      </div>
    </form>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { Coins, Layers, Save, Scale, Tag, Wallet } from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { Alert } from '@/app/src/components/ui/Alert';
import { Badge } from '@/app/src/components/ui/Badge';
import TextField from '@/app/src/components/ui/TextField';
import Button from '@/app/src/components/ui/Button';
import { formatMoney, toNumber } from '@/app/src/lib/format';

import BottleTypeSelector from '../components/BottleTypeSelector';
import { useAsyncData } from '../hooks/useAsyncData';
import { BOTTLE_TYPES, type BottleType } from '../data/bottleTypes';
import { fetchActiveCostPrices, saveCostPrice } from '../services/costPrices';
import { costPriceTotal, findActiveCostPrice } from '../utils/pricing';

interface CostPriceFormData {
  type: BottleType;
  price: string;
  labelCap: string;
  otherExpense: string;
}

const EMPTY_FORM: Omit<CostPriceFormData, 'type'> = {
  price: '',
  labelCap: '',
  otherExpense: '',
};

/** Cost inputs, in the order they are entered and totalled. */
const COST_FIELDS = [
  {
    key: 'price' as const,
    label: 'Per bottle price',
    hint: 'Raw production cost of one bottle',
    icon: Wallet,
  },
  {
    key: 'labelCap' as const,
    label: 'Label + cap',
    hint: 'Packaging cost per bottle',
    icon: Tag,
  },
  {
    key: 'otherExpense' as const,
    label: 'Other expenses',
    hint: 'Utilities, labour and overheads per bottle',
    icon: Layers,
  },
];

/**
 * Cost price — what one bottle costs to produce. Each size card carries its saved
 * total, so the figure being replaced stays visible while the new one is typed.
 */
export default function CostPricePage() {
  const [formData, setFormData] = useState<CostPriceFormData>({
    type: BOTTLE_TYPES[0],
    ...EMPTY_FORM,
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const costPrices = useAsyncData(fetchActiveCostPrices, {
    key: 'cost-prices',
    fallbackMessage: 'Current cost prices could not be loaded.',
  });

  const activePrices = costPrices.data ?? [];

  const handleTypeChange = (bottleType: BottleType) => {
    setFormData({ type: bottleType, ...EMPTY_FORM });
    setFieldErrors({});
    setFormError('');
  };

  /** Only the three cost amounts are editable through this handler. */
  const handleChange = (
    field: Exclude<keyof CostPriceFormData, 'type'>,
    value: string
  ) => {
    // Cost inputs are whole rupees only.
    setFormData((previous) => ({
      ...previous,
      [field]: value.replace(/[^0-9]/g, ''),
    }));

    setFieldErrors((previous) =>
      previous[field] ? { ...previous, [field]: '' } : previous
    );
    setFormError('');
  };

  const totalUnitCost = useMemo(
    () =>
      toNumber(formData.price) +
      toNumber(formData.labelCap) +
      toNumber(formData.otherExpense),
    [formData]
  );

  const currentForType = findActiveCostPrice(activePrices, formData.type);
  const currentTotal = currentForType ? costPriceTotal(currentForType) : null;

  /** Saved total per size, shown on its card. */
  const savedTotal = (bottleType: BottleType) => {
    if (costPrices.loading) return 'Loading…';
    if (costPrices.error) return '—';

    const entry = findActiveCostPrice(activePrices, bottleType);
    return entry ? formatMoney(costPriceTotal(entry)) : 'Not set';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.price.trim()) errors.price = 'Per bottle price is required.';
    if (!formData.labelCap.trim())
      errors.labelCap = 'Label + cap cost is required.';
    if (!formData.otherExpense.trim())
      errors.otherExpense = 'Other expenses are required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setFieldErrors({});
    setFormError('');

    try {
      const response = await saveCostPrice(formData);

      if (response?.success === false) {
        // Keep the entered values so the user can correct and resubmit.
        setFormError(response.message || 'The cost price could not be saved.');
        return;
      }

      setFormData((previous) => ({ type: previous.type, ...EMPTY_FORM }));
      costPrices.refresh();
    } catch (error) {
      setFormError(
        (error as Error)?.message || 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer width="form">
      <PageHeader
        eyebrow="Operations"
        title="Cost price"
        description="Record what one bottle costs to produce. These figures drive the cost and profit columns across the dashboard and monthly records."
      />

      <Card as="section">
        <CardHeader
          title="Record a cost price"
          description="Pick a bottle size, then enter what it costs to produce"
          icon={<Scale className="size-4" />}
        />

        <CardBody>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {formError ? <Alert tone="danger">{formError}</Alert> : null}

            {/* Non-blocking: a new cost price can still be saved without it. */}
            {costPrices.error ? (
              <Alert tone="warning" title="Saved prices unavailable">
                {costPrices.error} You can still record a new cost price.
              </Alert>
            ) : null}

            <BottleTypeSelector
              value={formData.type}
              onChange={handleTypeChange}
              caption={savedTotal}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {COST_FIELDS.map((field) => (
                <TextField
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  hint={field.hint}
                  icon={field.icon}
                  prefix="Rs"
                  type="text"
                  inputMode="numeric"
                  value={formData[field.key]}
                  onChange={(event) =>
                    handleChange(field.key, event.target.value)
                  }
                  placeholder="0"
                  error={fieldErrors[field.key]}
                  required
                />
              ))}
            </div>

            {/* Confirms the figure being committed, against the one it replaces. */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-field border border-line bg-surface-sunken px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-field bg-brand-50 text-brand-600">
                  <Coins className="size-4" />
                </span>
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">
                    Total cost per bottle
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {currentTotal === null
                      ? 'Production + packaging + overheads'
                      : `Replaces ${formatMoney(currentTotal)} for ${formData.type}`}
                  </p>
                </div>
              </div>

              <p className="tabular text-xl font-semibold text-ink">
                {formatMoney(totalUnitCost)}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Badge tone="neutral">Applies from today onward</Badge>

              <Button
                type="submit"
                label="Save cost price"
                loadingLabel="Saving…"
                loading={loading}
                icon={<Save className="size-4" />}
                className="sm:w-auto"
                fullWidth
              />
            </div>
          </form>
        </CardBody>
      </Card>
    </PageContainer>
  );
}

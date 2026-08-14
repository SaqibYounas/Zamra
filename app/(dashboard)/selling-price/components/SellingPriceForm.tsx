'use client';

import { useMemo, useState } from 'react';
import { Banknote, Save, Scale, Tag, TrendingUp } from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { Alert } from '@/app/src/components/ui/Alert';
import { Badge } from '@/app/src/components/ui/Badge';
import TextField from '@/app/src/components/ui/TextField';
import Button from '@/app/src/components/ui/Button';
import { formatMoney, formatPercent, toNumber } from '@/app/src/lib/format';

import BottleTypeSelector from '../../components/BottleTypeSelector';
import { BOTTLE_TYPES, type BottleType } from '../../data/bottleTypes';
import { saveSellingPrice } from '../../services/sellingPrices';
import type { CostPrice } from '../../types/prices';
import {
  findActiveCostPrice,
  type BottleRateSummary,
} from '../../utils/pricing';

interface Props {
  /** Cost-price records; a selling price must reference one of these. */
  prices: CostPrice[];
  summaries: BottleRateSummary[];
  onSaved: () => void;
}

export default function SellingPriceForm({
  prices,
  summaries,
  onSaved,
}: Props) {
  const [bottleType, setBottleType] = useState<BottleType>(BOTTLE_TYPES[0]);
  const [sellingPrice, setSellingPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  /*
   * `costRecord.id` is submitted as `priceManagementId`, so picking a superseded
   * row here would permanently link the new rate to the wrong cost price.
   */
  const costRecord = findActiveCostPrice(prices, bottleType);

  const costTotal = costRecord
    ? toNumber(costRecord.perBottlePrice) +
      toNumber(costRecord.labelCapPrice) +
      toNumber(costRecord.otherExpenses)
    : null;

  const current = summaries.find(
    (summary) => summary.bottleType === bottleType
  );

  // Live margin preview for the amount being typed.
  const preview = useMemo(() => {
    const value = toNumber(sellingPrice);
    if (!sellingPrice || costTotal === null) return null;

    const margin = value - costTotal;
    return {
      margin,
      marginPct: value === 0 ? 0 : (margin / value) * 100,
    };
  }, [sellingPrice, costTotal]);

  /** Rate already set for each size, shown on its card. */
  const savedRate = (size: BottleType) => {
    const summary = summaries.find((entry) => entry.bottleType === size);
    return summary?.sellingPrice === null || summary?.sellingPrice === undefined
      ? 'No rate'
      : formatMoney(summary.sellingPrice);
  };

  const handleTypeChange = (nextType: BottleType) => {
    setBottleType(nextType);
    setSellingPrice('');
    setError('');
    setFormError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sellingPrice.trim()) {
      setError('Selling price is required.');
      return;
    }

    if (!costRecord) {
      setFormError(
        `No cost price exists for ${bottleType}. Save its cost price first so the rate can be linked to it.`
      );
      return;
    }

    setLoading(true);
    setError('');
    setFormError('');

    try {
      const response = await saveSellingPrice({
        sellingPrice,
        priceManagementId: costRecord.id,
      });

      if (response?.success === false) {
        setFormError(
          response.message || 'The selling price could not be saved.'
        );
        return;
      }

      setSellingPrice('');
      onSaved();
    } catch (submitError) {
      setFormError(
        (submitError as Error)?.message || 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Literal class strings: Tailwind cannot generate a class from interpolation.
  const marginIconTone = !preview
    ? 'bg-brand-50 text-brand-600'
    : preview.margin >= 0
      ? 'bg-success-soft text-success-ink'
      : 'bg-danger-soft text-danger-ink';

  return (
    <Card as="section">
      <CardHeader
        title="Set a selling price"
        description="Pick a bottle size, then enter what customers are charged per bottle"
        icon={<Tag className="size-4" />}
      />

      <CardBody>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {formError ? <Alert tone="danger">{formError}</Alert> : null}

          {!costRecord ? (
            <Alert tone="warning" title="Cost price missing">
              A selling price has to reference a saved cost price. Add one for{' '}
              {bottleType} on the Cost price page first.
            </Alert>
          ) : null}

          <BottleTypeSelector
            value={bottleType}
            onChange={handleTypeChange}
            caption={savedRate}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              name="sellingPrice"
              label="Selling price per bottle"
              icon={Banknote}
              prefix="Rs"
              type="text"
              inputMode="numeric"
              value={sellingPrice}
              onChange={(event) => {
                setSellingPrice(event.target.value.replace(/[^0-9]/g, ''));
                setError('');
              }}
              placeholder="0"
              error={error}
              hint={
                current?.sellingPrice !== null &&
                current?.sellingPrice !== undefined
                  ? `Currently ${formatMoney(current.sellingPrice)}`
                  : 'No rate set yet for this size'
              }
              required
            />

            <TextField
              name="productionCost"
              label="Production cost"
              hint="Fixed by the saved cost price"
              icon={Scale}
              prefix="Rs"
              type="text"
              value={costTotal ?? ''}
              onChange={() => {}}
              placeholder="Not set"
              readOnly
              disabled
            />
          </div>

          {/* Margin at the rate being typed, against the cost it is linked to. */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-field border border-line bg-surface-sunken px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex size-8 items-center justify-center rounded-field ${marginIconTone}`}
              >
                <TrendingUp className="size-4" />
              </span>
              <div>
                <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">
                  Margin at this rate
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {costTotal === null
                    ? 'Needs a cost price first'
                    : `Against ${formatMoney(costTotal)} production cost`}
                </p>
              </div>
            </div>

            {preview ? (
              <p
                className={`tabular text-xl font-semibold ${
                  preview.margin >= 0 ? 'text-success-ink' : 'text-danger-ink'
                }`}
              >
                {formatMoney(preview.margin)}
                <span className="ml-1.5 text-xs font-medium text-ink-muted">
                  {formatPercent(preview.marginPct, 0)}
                </span>
              </p>
            ) : (
              <p className="tabular text-xl font-semibold text-ink">—</p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Badge tone="neutral">Charged from today onward</Badge>

            <Button
              type="submit"
              label="Save selling price"
              loadingLabel="Saving…"
              loading={loading}
              disabled={!costRecord}
              icon={<Save className="size-4" />}
              className="sm:w-auto"
              fullWidth
            />
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

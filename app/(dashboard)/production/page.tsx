'use client';

import { useMemo, useState } from 'react';
import { Boxes, Gauge, Layers, PackageCheck, Save } from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { Alert } from '@/app/src/components/ui/Alert';
import { Badge } from '@/app/src/components/ui/Badge';
import TextField from '@/app/src/components/ui/TextField';
import Button from '@/app/src/components/ui/Button';
import { formatNumber, toNumber } from '@/app/src/lib/format';

import BottleTypeSelector from '../components/BottleTypeSelector';
import { BOTTLE_TYPES, type BottleType } from '../data/bottleTypes';
import { saveDailyStock } from '../services/stock';

interface PackagingRule {
  /** Bottles in one pet/pack; sent to the backend as `bottlePerPet`. */
  perPet: number;
  inputLabel: string;
  unit: string;
  hint: string;
}

/**
 * How each size is counted on the floor. Keyed by the full union, so a new size
 * is a type error until its rule is defined.
 */
const PACKAGING: Record<BottleType, PackagingRule> = {
  '500ml': {
    perPet: 12,
    inputLabel: 'Total pets produced',
    unit: 'pets',
    hint: 'One pet contains 12 bottles',
  },
  '1.5L': {
    perPet: 6,
    inputLabel: 'Total pets produced',
    unit: 'pets',
    hint: 'One pet contains 6 bottles',
  },
  '5L': {
    perPet: 4,
    inputLabel: 'Total bottles produced',
    unit: 'bottles',
    hint: 'Counted in packs of 4',
  },
  '19L': {
    perPet: 1,
    inputLabel: 'Total bottles produced',
    unit: 'bottles',
    hint: 'Counted individually',
  },
  '19L Refill': {
    perPet: 1,
    inputLabel: 'Total refills completed',
    unit: 'refills',
    hint: 'Counted individually',
  },
};

export default function ProductionPage() {
  const [bottleType, setBottleType] = useState<BottleType>(BOTTLE_TYPES[0]);
  const [quantity, setQuantity] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const packaging = PACKAGING[bottleType];

  const totalBottles = useMemo(
    () => toNumber(quantity) * packaging.perPet,
    [quantity, packaging.perPet]
  );

  const handleTypeChange = (value: BottleType) => {
    setBottleType(value);
    setQuantity('');
    setFieldError('');
    setFormError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!quantity.trim()) {
      setFieldError(`${packaging.inputLabel} is required.`);
      return;
    }

    if (toNumber(quantity) <= 0) {
      setFieldError('Enter a quantity greater than zero.');
      return;
    }

    setLoading(true);
    setFieldError('');
    setFormError('');

    try {
      // `saveDailyStock` requests a toast on the response, so success and
      // API-side failures are announced once, globally — no local duplicate.
      const response = await saveDailyStock({
        bottleType,
        totalPet: quantity,
        bottlePerPet: String(packaging.perPet),
      });

      if (response?.success === false) {
        setFormError(
          response.message || 'Production could not be saved. Try again.'
        );
        return;
      }

      setQuantity('');
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
        title="Production"
        description="Log today's bottling output. Quantities feed straight into stock levels, cost totals and the monthly records."
      />

      <Card as="section">
        <CardHeader
          title="Log production"
          description="Pick a bottle size, then enter how much was produced"
          icon={<Gauge className="size-4" />}
        />

        <CardBody>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {formError ? <Alert tone="danger">{formError}</Alert> : null}

            <BottleTypeSelector
              value={bottleType}
              onChange={handleTypeChange}
              caption={(bottle) =>
                PACKAGING[bottle].perPet > 1
                  ? `${PACKAGING[bottle].perPet} per pet`
                  : 'Single unit'
              }
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                name="quantity"
                label={packaging.inputLabel}
                hint={packaging.hint}
                icon={Boxes}
                type="number"
                inputMode="numeric"
                min={0}
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  setFieldError('');
                }}
                placeholder="0"
                suffix={packaging.unit}
                error={fieldError}
                required
              />

              <TextField
                name="bottlePerPet"
                label="Bottles per pet"
                hint="Fixed by bottle size"
                icon={Layers}
                type="number"
                value={packaging.perPet}
                onChange={() => {}}
                readOnly
                disabled
              />
            </div>

            {/* Confirms what will actually be added to stock. */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-field border border-line bg-surface-sunken px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-field bg-brand-50 text-brand-600">
                  <PackageCheck className="size-4" />
                </span>
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">
                    Adds to stock
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {quantity
                      ? `${formatNumber(quantity)} ${packaging.unit}`
                      : '—'}
                    {packaging.perPet > 1 ? ` × ${packaging.perPet}` : ''}
                  </p>
                </div>
              </div>

              <p className="tabular text-xl font-semibold text-ink">
                {formatNumber(totalBottles)}{' '}
                <span className="text-xs font-medium text-ink-muted">
                  bottles
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Badge tone="neutral">Recorded against today&apos;s date</Badge>

              <Button
                type="submit"
                label="Save production"
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

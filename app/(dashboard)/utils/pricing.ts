import { toNumber } from '@/app/src/lib/format';
import { BOTTLE_TYPES, type BottleType } from '../data/bottleTypes';
import type { CostPrice, SellingPriceRecord } from '../types/prices';

export interface BottleRateSummary {
  bottleType: BottleType;
  /** `null` when no cost price has been recorded for this type. */
  costTotal: number | null;
  /** `null` when no selling price has been set for this type. */
  sellingPrice: number | null;
  /** Selling price minus cost; `null` when either side is missing. */
  margin: number | null;
  /** Margin as a share of the selling price; `null` when not computable. */
  marginPct: number | null;
}

/** Total cost of producing one bottle: production + packaging + overheads. */
export function costPriceTotal(price: CostPrice): number {
  return (
    toNumber(price.perBottlePrice) +
    toNumber(price.labelCapPrice) +
    toNumber(price.otherExpenses)
  );
}

export function findActiveCostPrice(
  costPrices: CostPrice[],
  bottleType: BottleType
): CostPrice | undefined {
  const forType = costPrices.filter((price) => price.bottleType === bottleType);
  if (forType.length <= 1) return forType[0];

  const active = forType.filter((price) => price.isActive === true);
  const candidates = active.length > 0 ? active : forType;

  // Highest id wins — a defensive tie-break if more than one row is flagged.
  return candidates.reduce((newest, price) =>
    price.id > newest.id ? price : newest
  );
}

export function buildRateSummaries(
  costPrices: CostPrice[],
  rates: SellingPriceRecord[]
): BottleRateSummary[] {
  return BOTTLE_TYPES.map((bottleType) => {
    const cost = findActiveCostPrice(costPrices, bottleType);
    const rate = rates.find(
      (entry) => entry.priceManagement?.bottleType === bottleType
    );

    const costTotal = cost ? costPriceTotal(cost) : null;
    const sellingPrice = rate ? toNumber(rate.sellingPrice) : null;

    const margin =
      costTotal !== null && sellingPrice !== null
        ? sellingPrice - costTotal
        : null;

    return {
      bottleType,
      costTotal,
      sellingPrice,
      margin,
      marginPct:
        margin === null
          ? null
          : sellingPrice
            ? (margin / sellingPrice) * 100
            : 0,
    };
  });
}

export function findPricingGaps(summaries: BottleRateSummary[]) {
  return {
    missingCost: summaries
      .filter((summary) => summary.costTotal === null)
      .map((summary) => summary.bottleType),
    missingRate: summaries
      .filter((summary) => summary.sellingPrice === null)
      .map((summary) => summary.bottleType),
    sellingBelowCost: summaries
      .filter((summary) => summary.margin !== null && summary.margin < 0)
      .map((summary) => summary.bottleType),
  };
}

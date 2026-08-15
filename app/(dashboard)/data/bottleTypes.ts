export const BOTTLE_TYPES = [
  '500ml',
  '1.5L',
  '5L',
  '19L',
  '19L Refill',
] as const;

export type BottleType = (typeof BOTTLE_TYPES)[number];

/** Options for `Dropdown`/`select` controls, in catalogue order. */
export const BOTTLE_TYPE_OPTIONS: { label: string; value: BottleType }[] =
  BOTTLE_TYPES.map((bottleType) => ({ label: bottleType, value: bottleType }));

/** A metric measured per bottle type, e.g. stock counts or costs. */
export type BottleTypeRecord<T = number> = Record<BottleType, T>;

/** A zeroed record, used as the accumulator when aggregating API rows. */
export function createBottleTypeRecord(): BottleTypeRecord {
  return Object.fromEntries(
    BOTTLE_TYPES.map((bottleType) => [bottleType, 0])
  ) as BottleTypeRecord;
}

/** Narrows an arbitrary API string to a known bottle type. */
export function toBottleType(value?: string | null): BottleType | null {
  return value && BOTTLE_TYPES.includes(value as BottleType)
    ? (value as BottleType)
    : null;
}

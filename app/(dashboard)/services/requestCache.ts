/**
 * Read-through cache for the service layer. Lives in the tab, not the server:
 * every read is a browser call carrying the caller's session cookie.
 */

/** How long a kind of data stays usable without refetching. */
export type CacheProfile = 'realtime' | 'short' | 'medium' | 'long';

const CACHE_PROFILES: Record<CacheProfile, number> = {
  /** No reuse; only concurrent callers share the in-flight request. */
  realtime: 0,
  /** Stock counts and the profit report — they move as the day is logged. */
  short: 30_000,
  /** Cost and selling prices; every write invalidates them explicitly. */
  medium: 120_000,
  /** Customer and warehouse directories, created only by invoicing. */
  long: 300_000,
};

interface CacheEntry {
  tags: readonly string[];
  expiresAt: number;
  value: unknown;
}

/** Settled values, keyed by request key. */
const entries = new Map<string, CacheEntry>();

/**
 * Requests in flight, keyed the same way. The dashboard's five hooks asked for
 * two endpoints twice each simultaneously; they now await one request.
 */
const inFlight = new Map<string, Promise<unknown>>();

export interface CacheOptions {
  /** Stable identity for the request, e.g. `selling-prices`. */
  key: string;
  /** Which data this is, for invalidation. */
  tags: readonly string[];
  profile?: CacheProfile;
  /** Skips any stored value; the request still dedupes with concurrent ones. */
  forceRefresh?: boolean;
}

/**
 * Service reads resolve rather than throw, so failures arrive as values. Storing
 * one would keep an error on screen after the cause cleared.
 */
function isCacheable(value: unknown): boolean {
  if (value === null || value === undefined) return false;

  return !(
    typeof value === 'object' &&
    'success' in value &&
    (value as { success?: unknown }).success === false
  );
}

/**
 * Runs `load` through the cache: a fresh value if one exists, else an in-flight
 * request if one is running, else a new request.
 */
export function cachedRequest<T>(
  load: () => Promise<T>,
  { key, tags, profile = 'short', forceRefresh = false }: CacheOptions
): Promise<T> {
  const ttl = CACHE_PROFILES[profile];

  if (!forceRefresh && ttl > 0) {
    const entry = entries.get(key);

    if (entry && entry.expiresAt > Date.now()) {
      return Promise.resolve(entry.value as T);
    }
  }

  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;

  const request = load()
    .then((value) => {
      if (ttl > 0 && isCacheable(value)) {
        entries.set(key, { tags, expiresAt: Date.now() + ttl, value });
      } else {
        // A failed read must not shadow a previously good value either.
        entries.delete(key);
      }

      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);

  return request;
}

/** Drops every entry carrying any of these tags; called after a write. */
export function revalidateTag(...tags: string[]): void {
  if (tags.length === 0) return;

  entries.forEach((entry, key) => {
    if (entry.tags.some((tag) => tags.includes(tag))) {
      entries.delete(key);
    }
  });
}

/**
 * Empties the cache. Must run on sign-out: the tab is reused by whoever signs
 * in next, and cached rows are that account's data.
 */
export function clearRequestCache(): void {
  entries.clear();
  inFlight.clear();
}

/** Cache tags, named after the data rather than the endpoint. */
export const CACHE_TAGS = {
  stock: 'stock',
  profit: 'profit',
  costPrices: 'cost-prices',
  sellingPrices: 'selling-prices',
  customers: 'customers',
  shippingAddresses: 'shipping-addresses',
  invoices: 'invoices',
} as const;

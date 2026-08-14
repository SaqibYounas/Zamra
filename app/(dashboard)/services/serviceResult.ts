import { AxiosError } from 'axios';

/**
 * Shared result handling: every service resolves rather than throws, and this is
 * the one place that turns an axios failure into a message.
 */

/** Returned instead of data when a request fails. */
export interface ServiceError {
  success: false;
  message: string;
}

/**
 * What a write returns. Narrow on purpose: callers only branch on `success` and
 * show `message`; any other backend fields pass through untyped.
 */
export interface MutationOutcome {
  success?: boolean;
  message?: string;
}

/** Shapes the backend and the route handlers use for error payloads. */
interface ErrorPayload {
  message?: string;
  error?: string;
  detail?: string;
}

/** Narrows a service result to its failure case; used by `useAsyncData`. */
export function isServiceError(value: unknown): value is ServiceError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as { success?: unknown }).success === false
  );
}

/**
 * Normalises a thrown value into a `ServiceError`. The backend is less
 * consistent than the route handlers, so `error` and `detail` are checked too.
 */
export function toServiceError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): ServiceError {
  const payload = (error as AxiosError<ErrorPayload>)?.response?.data;

  return {
    success: false,
    message: payload?.message || payload?.error || payload?.detail || fallback,
  };
}

/**
 * Pulls a list out of the several shapes the backend uses: a bare array, or an
 * envelope such as `{ data: [...] }` / `{ data: {...} }`.
 */
export function extractList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === 'object') {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object') return [data as T];
  }

  return [];
}

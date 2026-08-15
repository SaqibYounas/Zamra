import { AxiosError } from 'axios';

export interface ServiceError {
  success: false;
  message: string;
}

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

export function extractList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === 'object') {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object') return [data as T];
  }

  return [];
}

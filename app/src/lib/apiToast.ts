import axios from 'axios';

export type ApiToastType = 'success' | 'error' | 'info';

export interface ApiToast {
  id: number;
  title: string;
  message: string;
  type: ApiToastType;
}

const listeners = new Set<(toast: ApiToast) => void>();
let hasSetup = false;

function getToastTitle(type: ApiToastType, fallback: string) {
  if (type === 'success') return 'Success';
  if (type === 'error') return 'Error';
  return fallback;
}

function formatToastMessage(message: string, fallback: string) {
  const cleaned = message?.trim();
  if (!cleaned) return fallback;

  const normalized = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\b([A-Z]{2,})\b/g, ' $1 ')
    .trim();

  if (/network error|failed to fetch|connect/i.test(normalized)) {
    return 'Connection issue. Please check your internet and try again.';
  }

  if (/timeout/i.test(normalized)) {
    return 'The request took too long. Please try again.';
  }

  if (/unauthorized|session expired|login again/i.test(normalized)) {
    return 'Your session has expired. Please sign in again.';
  }

  if (/forbidden|not allowed|permission/i.test(normalized)) {
    return 'You do not have permission to perform this action.';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function dispatchToast(
  message: string,
  type: ApiToastType = 'info',
  title?: string
) {
  if (typeof window === 'undefined') {
    return;
  }

  const toast: ApiToast = {
    id: Date.now() + Math.random(),
    title: title || getToastTitle(type, 'Notice'),
    message: formatToastMessage(message, 'Request completed successfully'),
    type,
  };

  listeners.forEach((listener) => listener(toast));
}

export function subscribeApiToast(listener: (toast: ApiToast) => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function showApiToast(
  message: string,
  type: ApiToastType = 'info',
  title?: string
) {
  dispatchToast(message, type, title);
}

export function setupApiToastInterceptors() {
  if (hasSetup || typeof window === 'undefined') {
    return;
  }

  hasSetup = true;

  axios.interceptors.response.use(
    (response) => {
      const requestUrl = response?.config?.url;
      const skipToast =
        response?.config?.headers?.['x-skip-api-toast'] ||
        response?.config?.headers?.['X-Skip-Api-Toast'];

      const payload = response?.data;
      const statusCode = response?.status || payload?.status;
      if (statusCode === 401) {
        if (typeof window !== 'undefined') {
          dispatchToast(
            'Your session has expired. Please sign in again.',
            'info',
            'Session expired'
          );
          window.location.href = '/';
        }
        return response;
      }

      if (skipToast || requestUrl?.includes('/api/chatbot')) {
        return response;
      }

      const isFailure = payload?.success === false || payload?.error;
      const message =
        payload?.message ||
        payload?.error ||
        payload?.successMessage ||
        payload?.detail ||
        payload?.msg ||
        (isFailure ? 'Request failed' : 'Request completed successfully');

      dispatchToast(message, isFailure ? 'error' : 'success');
      return response;
    },
    (error) => {
      const requestUrl = error?.config?.url;
      const skipToast =
        error?.config?.headers?.['x-skip-api-toast'] ||
        error?.config?.headers?.['X-Skip-Api-Toast'];

      const status = error?.response?.status;
      if (status === 401) {
        if (typeof window !== 'undefined') {
          dispatchToast(
            'Your session has expired. Please sign in again.',
            'info',
            'Session expired'
          );
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (skipToast || requestUrl?.includes('/api/chatbot')) {
        return Promise.reject(error);
      }

      const payload = error?.response?.data;
      const message =
        payload?.message ||
        payload?.error ||
        payload?.detail ||
        payload?.msg ||
        error?.message ||
        'Request failed';

      dispatchToast(message, 'error');
      return Promise.reject(error);
    }
  );
}

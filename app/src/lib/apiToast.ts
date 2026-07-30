import axios from 'axios';

export type ApiToastType = 'success' | 'error' | 'info';

export interface ApiToast {
  id: number;
  title: string;
  message: string;
  type: ApiToastType;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    showToast?: boolean;
  }
}

const listeners = new Set<(toast: ApiToast) => void>();

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
  if (typeof window === 'undefined') return;

  const toast: ApiToast = {
    id: Date.now() + Math.random(),
    title: title || getToastTitle(type, 'Notice'),
    message: formatToastMessage(
      message,
      type === 'success' ? 'Request completed successfully' : 'Request failed'
    ),
    type,
  };

  listeners.forEach((listener) => listener(toast));
}

export function subscribeApiToast(listener: (toast: ApiToast) => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function showApiToast(
  message: string,
  type: ApiToastType = 'info',
  title?: string
) {
  dispatchToast(message, type, title);
}

let hasSetup = false;

export function setupApiToastInterceptors(onUnauthorized?: () => void) {
  if (hasSetup || typeof window === 'undefined') {
    return;
  }

  hasSetup = true;

  axios.interceptors.response.use(
    (response) => {
      const showToast = response.config.showToast;

      if (showToast) {
        const payload = response.data;

        const isFailure = payload?.success === false || payload?.error;

        const message =
          payload?.message ||
          payload?.successMessage ||
          payload?.msg ||
          'Request completed successfully';

        dispatchToast(message, isFailure ? 'error' : 'success');
      }

      return response;
    },

    (error) => {
      const showToast = error?.config?.showToast;
      const status = error?.response?.status;

      // 401 Session Expired Handling
      if (status === 401) {
        if (showToast) {
          dispatchToast(
            'Your session has expired. Please sign in again.',
            'info',
            'Session Expired'
          );
        }

        // ❌ Direct `window.location.href = '/'` hata diya gaya hai.
        // Client-side callback execute hoga agar provide kiya gaya ho.
        if (onUnauthorized) {
          onUnauthorized();
        }

        return Promise.reject(error);
      }

      if (showToast) {
        const payload = error?.response?.data;

        const message =
          payload?.message ||
          payload?.error ||
          payload?.detail ||
          payload?.msg ||
          error?.message ||
          'Request failed';

        dispatchToast(message, 'error');
      }

      return Promise.reject(error);
    }
  );
}

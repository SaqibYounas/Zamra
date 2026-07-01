import axios from 'axios';

export type ApiToastType = 'success' | 'error' | 'info';

export interface ApiToast {
  id: number;
  message: string;
  type: ApiToastType;
}

const listeners = new Set<(toast: ApiToast) => void>();
let hasSetup = false;

function dispatchToast(message: string, type: ApiToastType = 'info') {
  if (typeof window === 'undefined') {
    return;
  }

  const toast: ApiToast = {
    id: Date.now() + Math.random(),
    message,
    type,
  };

  listeners.forEach((listener) => listener(toast));
}

export function subscribeApiToast(listener: (toast: ApiToast) => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function showApiToast(message: string, type: ApiToastType = 'info') {
  dispatchToast(message, type);
}

export function setupApiToastInterceptors() {
  if (hasSetup || typeof window === 'undefined') {
    return;
  }

  hasSetup = true;

  axios.interceptors.response.use(
    (response) => {
      const payload = response?.data;
      const isFailure = payload?.success === false || payload?.error;
      const message =
        payload?.message ||
        payload?.error ||
        payload?.successMessage ||
        payload?.detail ||
        payload?.msg ||
        'Request completed successfully';

      dispatchToast(message, isFailure ? 'error' : 'success');
      return response;
    },
    (error) => {
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

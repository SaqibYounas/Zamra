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
      const requestUrl = response?.config?.url;
      const skipToast =
        response?.config?.headers?.['x-skip-api-toast'] ||
        response?.config?.headers?.['X-Skip-Api-Toast'];

      const payload = response?.data;
      const statusCode = response?.status || payload?.status;
      if (statusCode === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
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
        'Request completed successfully';

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

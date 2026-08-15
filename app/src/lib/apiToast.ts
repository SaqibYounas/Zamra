import axios from 'axios';

export type ApiToastType = 'success' | 'error' | 'info';

export interface ApiToast {
  id: number;
  title: string;
  message: string;
  type: ApiToastType;
}

// Extend Axios config with an optional showToast flag.
declare module 'axios' {
  export interface AxiosRequestConfig {
    showToast?: boolean;
  }
}

// Stores all active toast listeners.
const listeners = new Set<(toast: ApiToast) => void>();

function getToastTitle(type: ApiToastType) {
  if (type === 'success') return 'Success';
  if (type === 'error') return 'Error';
  return 'Information';
}

// Cleans and normalizes API error/success messages.
function formatMessage(message: string, fallback: string) {
  const text = message?.trim();

  if (!text) return fallback;

  const normalized = text.replace(/\s+/g, ' ');

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

// Creates a toast and notifies all subscribed listeners.
function dispatchToast(
  message: string,
  type: ApiToastType = 'info',
  title?: string
) {
  if (typeof window === 'undefined') return;

  const fallback =
    type === 'success'
      ? 'Operation completed successfully.'
      : 'Request failed.';

  const toast: ApiToast = {
    id: Date.now() + Math.random(),
    title: title ?? getToastTitle(type),
    message: formatMessage(message, fallback),
    type,
  };

  listeners.forEach((listener) => listener(toast));
}

// Subscribes a component to toast updates.
export function subscribeApiToast(listener: (toast: ApiToast) => void) {
  listeners.add(listener);

  // Remove the listener when the component unmounts.
  return () => {
    listeners.delete(listener);
  };
}

// Allows the application to show a toast manually.
export function showApiToast(
  message: string,
  type: ApiToastType = 'info',
  title?: string
) {
  dispatchToast(message, type, title);
}

let interceptorsSetup = false;

export function setupApiToastInterceptors(onUnauthorized?: () => void) {
  // Prevent registering the same interceptor multiple times.
  if (interceptorsSetup || typeof window === 'undefined') {
    return;
  }

  interceptorsSetup = true;

  axios.interceptors.response.use(
    // Handles successful HTTP responses.
    (response) => {
      if (!response.config.showToast) {
        return response;
      }

      const data = response.data;

      // Some APIs return HTTP 200 but still indicate an application-level failure.
      const failed = data?.success === false || Boolean(data?.error);

      const message =
        data?.message ??
        data?.successMessage ??
        data?.msg ??
        (failed ? 'Request failed.' : 'Operation completed successfully.');

      dispatchToast(message, failed ? 'error' : 'success');

      return response;
    },

    // Handles failed HTTP requests.
    (error) => {
      const showToast = error?.config?.showToast;
      const status = error?.response?.status;

      // Handle expired or invalid sessions.
      if (status === 401) {
        if (showToast) {
          dispatchToast(
            'Your session has expired. Please sign in again.',
            'info',
            'Session Expired'
          );
        }

        onUnauthorized?.();

        return Promise.reject(error);
      }

      // Handle all other API errors.
      if (showToast) {
        const data = error?.response?.data;

        const message =
          data?.message ??
          data?.error ??
          data?.detail ??
          data?.msg ??
          error?.message ??
          'Request failed.';

        dispatchToast(message, 'error');
      }

      // Keep the original error available to the caller.
      return Promise.reject(error);
    }
  );
}

import axios from 'axios';

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

let isInterceptorAttached = false;
export function attachAuthTokenToAxios() {
  if (typeof window === 'undefined' || isInterceptorAttached) return;

  isInterceptorAttached = true;
  axios.interceptors.request.use(
    (config) => {
      const token = getTokenFromCookie();

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        delete config.headers['Authorization'];
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export function clearAuthTokenFromAxios() {
  if (typeof window === 'undefined') return;
  delete axios.defaults.headers.common['Authorization'];
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

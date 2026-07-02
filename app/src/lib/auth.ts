import axios from 'axios';

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function attachAuthTokenToAxios() {
  if (typeof window === 'undefined') return;
  const token = getTokenFromCookie();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export function clearAuthTokenFromAxios() {
  if (typeof window === 'undefined') return;
  delete axios.defaults.headers.common['Authorization'];
}

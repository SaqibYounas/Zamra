export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'zamra:theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('${DARK_QUERY}').matches;document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light';

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}

  window.dispatchEvent(new Event('theme-change'));
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function subscribeTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('theme-change', callback);
  window.addEventListener('storage', callback);
  const media = window.matchMedia(DARK_QUERY);

  const handleSystemThemeChange = () => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === 'light' || stored === 'dark') return;

    const theme: Theme = media.matches ? 'dark' : 'light';

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    callback();
  };

  media.addEventListener('change', handleSystemThemeChange);

  return () => {
    window.removeEventListener('theme-change', callback);
    window.removeEventListener('storage', callback);
    media.removeEventListener('change', handleSystemThemeChange);
  };
}

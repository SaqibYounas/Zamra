type Listener = () => void;

export type BooleanSetting = {
  subscribe: (listener: Listener) => () => void;
  get: () => boolean;
  getServerSnapshot: () => boolean;
  set: (value: boolean) => void;
  toggle: () => void;
};

export function createBooleanPreference(
  key: string,
  fallback = false
): BooleanSetting {
  const listeners = new Set<Listener>();
  let hydrated = false;
  let value = fallback;

  const read = () => {
    if (typeof window === 'undefined') return fallback;

    if (!hydrated) {
      try {
        const stored = window.localStorage.getItem(key);
        value = stored === null ? fallback : stored === '1';
      } catch {
        value = fallback;
      }
      hydrated = true;
    }

    return value;
  };

  const emit = () => listeners.forEach((listener) => listener());

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key !== key) return;
        value = event.newValue === '1';
        hydrated = true;
        emit();
      };

      window.addEventListener('storage', onStorage);

      return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
      };
    },

    get: read,
    getServerSnapshot: () => fallback,

    set: (next) => {
      read();
      if (value === next) return;

      value = next;
      hydrated = true;

      try {
        window.localStorage.setItem(key, next ? '1' : '0');
      } catch {}

      emit();
    },

    toggle() {
      this.set(!read());
    },
  };
}

export const sidebarCollapsed = createBooleanPreference(
  'zamra:sidebar-collapsed',
  false
);

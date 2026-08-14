/**
 * Tiny observable wrapper around a single `localStorage` flag.
 *
 * Exists so components can read a persisted UI preference through
 * `useSyncExternalStore`, which takes an explicit server snapshot. Reading
 * storage in an effect instead would either flash the wrong state or trip the
 * "no setState in effect" rule.
 */

type Listener = () => void;

export type BooleanSetting = {
  subscribe: (listener: Listener) => () => void;
  get: () => boolean;
  /** Server/prerender snapshot — storage does not exist there. */
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
        // Private-mode or blocked storage: keep the fallback.
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

      // Keep multiple tabs in step.
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
      } catch {
        // Preference simply will not persist; the session still works.
      }

      emit();
    },

    toggle() {
      this.set(!read());
    },
  };
}

/** Desktop sidebar rail: collapsed to icons only. */
export const sidebarCollapsed = createBooleanPreference(
  'zamra:sidebar-collapsed',
  false
);

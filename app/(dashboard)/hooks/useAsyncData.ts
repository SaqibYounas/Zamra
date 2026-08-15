'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isServiceError, type ServiceError } from '../services/serviceResult';

export interface AsyncData<T> {
  data: T | null;
  /** A message ready to display, never a raw error object. */
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => void;
}

interface Settled<T> {
  data: T | null;
  error: string | null;
  /** The `key` this result answers, so stale params never render as fresh. */
  key: string;
}

export function useAsyncData<T>(
  load: (options: { forceRefresh: boolean }) => Promise<T | ServiceError>,
  options: { key?: string; fallbackMessage?: string } = {}
): AsyncData<T> {
  const { key = 'default', fallbackMessage } = options;

  // Refs so an inline closure does not retrigger the fetch; `key` is the
  // dependency. Updated in an effect declared before the fetching one.
  const loadRef = useRef(load);
  const fallbackRef = useRef(fallbackMessage);

  useEffect(() => {
    loadRef.current = load;
    fallbackRef.current = fallbackMessage;
  });

  const [attempt, setAttempt] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  const forceNextRef = useRef(false);

  const isCurrent = settled?.key === key;

  useEffect(() => {
    let active = true;

    async function run() {
      const forceRefresh = forceNextRef.current;
      forceNextRef.current = false;

      const result = await loadRef.current({ forceRefresh });

      if (!active) return;

      setSettled(
        isServiceError(result)
          ? {
              data: null,
              error:
                result.message ||
                fallbackRef.current ||
                'This data could not be loaded.',
              key,
            }
          : { data: result, error: null, key }
      );

      setRefreshing(false);
    }

    run();

    return () => {
      active = false;
    };
    // `attempt` is here so `refresh()` re-runs the effect for an unchanged key.
  }, [key, attempt]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    forceNextRef.current = true;
    setAttempt((current) => current + 1);
  }, []);

  return {
    data: isCurrent ? settled.data : null,
    error: isCurrent ? settled.error : null,
    loading: !isCurrent,
    refreshing,
    refresh,
  };
}

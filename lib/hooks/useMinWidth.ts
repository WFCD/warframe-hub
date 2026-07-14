'use client';

import { useSyncExternalStore } from 'react';

/** SSR-safe viewport query — server + hydration use `false`, then syncs to matchMedia. */
export function useMinWidth(px: number): boolean {
  const query = `(min-width: ${px}px)`;

  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

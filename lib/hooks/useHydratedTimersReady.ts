'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/** False on server + during hydration; true once prefs/worldstate storage have hydrated client-side. */
export const useHydratedTimersReady = (prefsReady: boolean, storageHydrated: boolean): boolean =>
  useSyncExternalStore(noopSubscribe, () => prefsReady && storageHydrated, () => false);

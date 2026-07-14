'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False on server and during hydration; true after client mount. */
export const useClientMounted = (): boolean =>
  useSyncExternalStore(subscribe, () => true, () => false);

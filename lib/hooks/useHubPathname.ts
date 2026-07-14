'use client';

import { useSyncExternalStore } from 'react';

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedPathname = '/';
let patched = false;

const readPathname = (): string => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

const notify = () => {
  const next = readPathname();
  if (next === cachedPathname) return;
  cachedPathname = next;
  listeners.forEach((listener) => listener());
};

/** Patch once so App Router soft nav (pushState/replaceState) updates subscribers. */
const ensureHistoryPatch = () => {
  if (patched || typeof window === 'undefined') return;
  patched = true;
  cachedPathname = readPathname();
  window.addEventListener('popstate', notify);
  const { pushState, replaceState } = window.history;
  window.history.pushState = function hubPushState(...args) {
    const result = pushState.apply(this, args as Parameters<typeof pushState>);
    notify();
    return result;
  };
  window.history.replaceState = function hubReplaceState(...args) {
    const result = replaceState.apply(this, args as Parameters<typeof replaceState>);
    notify();
    return result;
  };
};

const subscribe = (listener: Listener) => {
  ensureHistoryPatch();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => {
  ensureHistoryPatch();
  return cachedPathname;
};

/** SSR / hydration: no route knowledge yet — callers should treat as inactive until client mount. */
const getServerSnapshot = () => '/';

/**
 * Pathname for active-nav highlighting.
 * Avoids vinext `next/navigation` SSR race where `usePathname` can be undefined
 * while Vite is mid-flight optimizing that shim.
 */
export const useHubPathname = (): string =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

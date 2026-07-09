export const shouldPersist = (): boolean => {
  const val = globalThis.process?.env?.NEXT_PUBLIC_PERSIST;
  return (val === undefined ? 'true' : val) === 'true';
};

export const readStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined' || !shouldPersist()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const writeStorage = (key: string, value: unknown): boolean => {
  if (typeof window === 'undefined' || !shouldPersist()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      return false;
    }
    return false;
  }
};

export const removeStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
};

export const clearHubStorage = (): void => {
  if (typeof window === 'undefined') return;
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith('hub.v1.'))
    .forEach((k) => window.localStorage.removeItem(k));
};

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const debouncedWriteStorage = (key: string, value: unknown, ms = 300): void => {
  const existing = debounceTimers.get(key);
  if (existing) clearTimeout(existing);
  debounceTimers.set(
    key,
    setTimeout(() => {
      writeStorage(key, value);
      debounceTimers.delete(key);
    }, ms)
  );
};

import { useEffect } from 'react';

export const usePersistedState = (key: string, state: unknown, enabled = true): void => {
  useEffect(() => {
    if (enabled) debouncedWriteStorage(key, state);
  }, [key, state, enabled]);
};

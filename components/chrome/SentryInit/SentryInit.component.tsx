'use client';

import { useEffect, type FC } from 'react';
import * as Sentry from '@sentry/react';
import { getRuntimeDsn } from '@/lib/sentry/runtimeEnv';

let initialized = false;
let runtimeEnvPromise: Promise<void> | null = null;

const loadRuntimeEnv = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.__HUB_RUNTIME_ENV__) return Promise.resolve();
  if (runtimeEnvPromise) return runtimeEnvPromise;

  runtimeEnvPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-hub-runtime-env]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => resolve(), { once: true });
      // Already loaded
      if (window.__HUB_RUNTIME_ENV__) resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '/runtime-env.js';
    script.async = true;
    script.dataset.hubRuntimeEnv = '1';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

  return runtimeEnvPromise;
};

const SentryInit: FC = () => {
  useEffect(() => {
    if (initialized) return;
    void loadRuntimeEnv().then(() => {
      if (initialized) return;
      const dsn = getRuntimeDsn();
      if (!dsn) return;
      Sentry.init({
        dsn,
        integrations: [],
      });
      initialized = true;
    });
  }, []);

  return null;
};

export default SentryInit;

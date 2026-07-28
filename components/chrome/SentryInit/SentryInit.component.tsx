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
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-hub-runtime-env]');
    if (existing) {
      if (window.__HUB_RUNTIME_ENV__) {
        done();
        return;
      }
      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', done, { once: true });
      // load/error may already have fired without setting runtime env
      setTimeout(done, 50);
      return;
    }

    const script = document.createElement('script');
    script.src = '/runtime-env.js';
    script.async = true;
    script.dataset.hubRuntimeEnv = '1';
    script.onload = done;
    script.onerror = done;
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

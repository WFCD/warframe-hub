'use client';

import { useEffect, type FC } from 'react';
import * as Sentry from '@sentry/react';
import { getRuntimeDsn } from '@/lib/sentry/runtimeEnv';

let initialized = false;

const SentryInit: FC = () => {
  useEffect(() => {
    if (initialized) return;
    const dsn = getRuntimeDsn();
    if (!dsn) return;
    Sentry.init({
      dsn,
      integrations: [],
    });
    initialized = true;
  }, []);

  return null;
};

export default SentryInit;

'use client';

import { createContext, useContext, useEffect, useState, type ReactNode, type FC } from 'react';
import { isTestMode, getDataMode } from './dataMode';
import { buildTimersFullWorldstate, buildWorldstate } from '@wfcd/shared';

type TestPayload = {
  worldstate?: ReturnType<typeof buildWorldstate>;
  platform?: string;
};

type TestContextValue = {
  mode: ReturnType<typeof getDataMode>;
  inject: (payload: TestPayload) => void;
};

const TestContext = createContext<TestContextValue | null>(null);

declare global {
  interface Window {
    __HUB_SET_TEST_DATA__?: (payload: TestPayload) => void;
    __HUB_GET_STATE__?: () => Record<string, unknown>;
  }
}
const TestDataProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [mode] = useState(getDataMode);

  useEffect(() => {
    if (!isTestMode()) return;

    window.__HUB_SET_TEST_DATA__ = (payload) => {
      if (payload.worldstate && payload.platform) {
        localStorage.setItem(`hub.v1.ws.${payload.platform}`, JSON.stringify(payload.worldstate));
      }
    };

    const params = new URLSearchParams(window.location.search);
    const fixture = params.get('fixture');
    if (fixture === 'timers-full') {
      localStorage.setItem('hub.v1.ws.pc', JSON.stringify(buildTimersFullWorldstate()));
    }
  }, []);

  const value: TestContextValue = {
    mode,
    inject: (payload) => window.__HUB_SET_TEST_DATA__?.(payload),
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
export default TestDataProvider;

export const useTestData = (): TestContextValue => {
  const ctx = useContext(TestContext);
  if (!ctx) throw new Error('useTestData must be used within TestDataProvider');
  return ctx;
};

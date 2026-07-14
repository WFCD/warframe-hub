'use client';

import { createContext, useContext, useLayoutEffect, useState, type ReactNode, type FC } from 'react';
import { buildTimersFullWorldstate, buildWorldstate, normalizePlatform } from '@/lib/shared';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import { useWorldstate, seedWorldstate } from '@/lib/providers/WorldstateProvider';
import { isTestMode, getDataMode } from './dataMode';

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
  const { state: prefs } = usePrefs();
  const { dispatch } = useWorldstate();

  useLayoutEffect(() => {
    if (!isTestMode()) return;

    window.__HUB_SET_TEST_DATA__ = (payload) => {
      if (payload.worldstate && payload.platform) {
        const platform = normalizePlatform(payload.platform);
        seedWorldstate(platform, payload.worldstate);
        dispatch({
          type: 'HYDRATE_PLATFORM',
          payload: { platform, data: payload.worldstate },
        });
      }
    };

    const params = new URLSearchParams(window.location.search);
    const fixture = params.get('fixture');
    if (fixture === 'timers-full') {
      const platform = normalizePlatform(prefs.platform);
      const worldstate = buildTimersFullWorldstate();
      seedWorldstate(platform, worldstate);
      dispatch({
        type: 'HYDRATE_PLATFORM',
        payload: { platform, data: worldstate },
      });
    }
  }, [dispatch, prefs.platform]);

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

'use client';
import './ClientShell.component.scss';

import type { ReactNode, FC } from 'react';
import { lazy, Suspense, useState } from 'react';
import { heroUiThemeForHub } from '@/lib/hubTheme';
import themes from '@/data/json/themes.json';
import HubNavbar from '@/components/chrome/Navbar';
import InAppNotificationHost from '@/components/chrome/InAppNotificationHost';
import TestDataProvider from '@/lib/test/TestDataProvider';
import { dismissVinextDevOverlay } from '@/lib/test/dismissVinextDevOverlay';
import { isHubTestMode } from '@/lib/test/dataMode';
import { PageChromeProvider } from '@/lib/providers/PageChromeProvider';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import { useEffect } from 'react';
import '@/styles/hub-vendor.css';
import '@/styles/hub.scss';
import { registerHubTestActions } from '@/lib/test/hubTestBridge';

const SettingsModal = lazy(() => import('@/components/modals/SettingsModal'));
const AboutModal = lazy(() => import('@/components/modals/AboutModal'));
const PwaUpdatePrompt = lazy(() => import('@/components/chrome/PwaUpdatePrompt'));

const ThemeSync: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { state } = usePrefs();

  useEffect(() => {
    const theme = themes.find((t) => t.key === state.theme);
    const hubTheme = state.theme;
    const heroTheme = heroUiThemeForHub(hubTheme);
    document.documentElement.setAttribute('data-theme', heroTheme);
    document.documentElement.setAttribute('data-hub-theme', hubTheme);
    document.body.className = theme?.className ?? 'night';
  }, [state.theme]);

  return <>{children}</>;
};
const PwaUpdatePromptGate: FC = () => {
  if (process.env.NODE_ENV !== 'production') return null;
  return (
    <Suspense fallback={null}>
      <PwaUpdatePrompt />
    </Suspense>
  );
};
const ClientShell: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    void import('@/lib/defer/loadFontAwesome');
  }, []);

  useEffect(() => {
    if (!isHubTestMode()) return;
    const clearDevOverlay = () => dismissVinextDevOverlay();
    clearDevOverlay();
    const observer = new MutationObserver(clearDevOverlay);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    registerHubTestActions({
      openSettings: () => setShowSettings(true),
      openAbout: () => setShowAbout(true),
    });
  }, []);

  return (
    <TestDataProvider>
      <ThemeSync>
        <PageChromeProvider>
          <div className="hub-theme-backdrop" aria-hidden />
          <div className="hub-sacrifice-backdrop" aria-hidden />
          <div id="app">
            <HubNavbar onOpenSettings={() => setShowSettings(true)} onOpenAbout={() => setShowAbout(true)} />
            <InAppNotificationHost />
            {showSettings ? (
              <Suspense fallback={null}>
                <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} />
              </Suspense>
            ) : null}
            {showAbout ? (
              <Suspense fallback={null}>
                <AboutModal show={showAbout} onHide={() => setShowAbout(false)} />
              </Suspense>
            ) : null}
            <PwaUpdatePromptGate />
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </PageChromeProvider>
      </ThemeSync>
    </TestDataProvider>
  );
};
export default ClientShell;

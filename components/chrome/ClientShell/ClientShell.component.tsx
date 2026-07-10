'use client';
import './ClientShell.component.scss';

import type { ReactNode, FC } from 'react';
import { lazy, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { heroUiThemeForHub } from '@/lib/hubTheme';
import themes from '@/data/json/themes.json';
import HubNavbar from '@/components/chrome/Navbar';
import InAppNotificationHost from '@/components/chrome/InAppNotificationHost';
import TestDataProvider from '@/lib/test/TestDataProvider';
import { PageChromeProvider } from '@/lib/providers/PageChromeProvider';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/styles/hub-vendor.css';
import '@/styles/hub.scss';

const SettingsModal = dynamic(() => import('@/components/modals/SettingsModal'), { ssr: false });
const AboutModal = dynamic(() => import('@/components/modals/AboutModal'), { ssr: false });
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

  return (
    <TestDataProvider>
      <ThemeSync>
        <PageChromeProvider>
          <div className="hub-theme-backdrop" aria-hidden />
          <div className="hub-sacrifice-backdrop" aria-hidden />
          <div id="app">
            <HubNavbar onOpenSettings={() => setShowSettings(true)} onOpenAbout={() => setShowAbout(true)} />
            <InAppNotificationHost />
            <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} />
            <AboutModal show={showAbout} onHide={() => setShowAbout(false)} />
            <PwaUpdatePromptGate />
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </PageChromeProvider>
      </ThemeSync>
    </TestDataProvider>
  );
};
export default ClientShell;

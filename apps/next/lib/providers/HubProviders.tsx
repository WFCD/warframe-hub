'use client';

import PrefsProvider from './PrefsProvider';
import MapsProvider from './MapsProvider';
import NotificationsProvider from './NotificationsProvider';
import WorldstateProvider from './WorldstateProvider';
import CacheProvider from './CacheProvider';
import I18nSync from '../I18nSync';
import type { ReactNode, FC } from 'react';
import '../i18n';
const HubProviders: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  return (
    <PrefsProvider>
      <I18nSync>
        <MapsProvider>
          <NotificationsProvider>
            <WorldstateProvider>
              <CacheProvider>{children}</CacheProvider>
            </WorldstateProvider>
          </NotificationsProvider>
        </MapsProvider>
      </I18nSync>
    </PrefsProvider>
  );
};
export default HubProviders;

'use client';

import { useEffect, type FC } from 'react';
import { usePrefs } from './providers/PrefsProvider';
import i18n from './i18n';
import i18nCore from './i18nCore';
import { ensureI18nLocale } from './i18n/localeBundles';

const I18nSync: FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const { state } = usePrefs();

  useEffect(() => {
    void (async () => {
      await ensureI18nLocale(i18n, state.locale);
      await ensureI18nLocale(i18nCore, state.locale);
      await i18n.changeLanguage(state.locale);
      await i18nCore.changeLanguage(state.locale);
    })();
  }, [state.locale]);

  return children;
};
export default I18nSync;

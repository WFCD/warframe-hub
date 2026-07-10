'use client';

import { useEffect, type FC } from 'react';
import { usePrefs } from './providers/PrefsProvider';
import i18n from './i18n';
import i18nCore from './i18nCore';
const I18nSync: FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const { state } = usePrefs();

  useEffect(() => {
    void i18n.changeLanguage(state.locale);
    void i18nCore.changeLanguage(state.locale);
  }, [state.locale]);

  return children;
};
export default I18nSync;

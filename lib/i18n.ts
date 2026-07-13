import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultLocaleResources } from '@/lib/i18n/localeBundles';

void i18n.use(initReactI18next).init({
  resources: defaultLocaleResources,
  lng: 'en',
  fallbackLng: 'en',
  showSupportNotice: false,
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
  react: {
    useSuspense: false,
  },
});

export const cycleStateKey = (cycle?: { state?: string; active?: string } | null): string => {
  const raw = cycle?.state ?? cycle?.active;
  if (!raw) return 'loading';
  return raw.toLowerCase();
};

export const tCycleState = (
  t: (key: string, options?: { defaultValue?: string }) => string,
  cycle?: { state?: string; active?: string } | null
): string => {
  const key = cycleStateKey(cycle);
  return t(`time.${key}`, { defaultValue: key });
};

export default i18n;

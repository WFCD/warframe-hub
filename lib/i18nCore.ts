import { createInstance } from 'i18next';

import { defaultLocaleResources } from '@/lib/i18n/localeBundles';

/** SSR / notifier-safe i18next — no react-i18next (avoids createContext in RSC eval). */
const i18nCore = createInstance();

void i18nCore.init({
  resources: defaultLocaleResources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
});

export default i18nCore;

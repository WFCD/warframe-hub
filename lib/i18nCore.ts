import { createInstance } from 'i18next';

import cs from '@/lib/locales/cs.json';
import de from '@/lib/locales/de.json';
import en from '@/lib/locales/en.json';
import es from '@/lib/locales/es.json';
import fr from '@/lib/locales/fr.json';
import it from '@/lib/locales/it.json';
import ko from '@/lib/locales/ko.json';
import pl from '@/lib/locales/pl.json';
import pt from '@/lib/locales/pt.json';
import ru from '@/lib/locales/ru.json';
import sr from '@/lib/locales/sr.json';
import tr from '@/lib/locales/tr.json';
import zh from '@/lib/locales/zh.json';

/** SSR / notifier-safe i18next — no react-i18next (avoids createContext in RSC eval). */
const i18nCore = createInstance();

void i18nCore.init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
    de: { translation: de },
    es: { translation: es },
    fr: { translation: fr },
    it: { translation: it },
    ko: { translation: ko },
    pl: { translation: pl },
    pt: { translation: pt },
    ru: { translation: ru },
    sr: { translation: sr },
    tr: { translation: tr },
    zh: { translation: zh },
  },
  fallbackLng: 'en',
  showSupportNotice: false,
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
});

export default i18nCore;

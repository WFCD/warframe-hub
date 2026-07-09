import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/lib/locales/en.json';
import cs from '@/lib/locales/cs.json';
import de from '@/lib/locales/de.json';
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

const resources = {
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
};

void i18n.use(initReactI18next).init({
  resources,
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

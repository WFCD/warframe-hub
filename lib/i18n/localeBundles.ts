import type { i18n as I18nInstance } from 'i18next';

import en from '@/lib/locales/en.json';

type LocaleJson = typeof en;

const localeLoaders: Record<string, () => Promise<{ default: LocaleJson }>> = {
  cs: () => import('@/lib/locales/cs.json'),
  de: () => import('@/lib/locales/de.json'),
  es: () => import('@/lib/locales/es.json'),
  fr: () => import('@/lib/locales/fr.json'),
  it: () => import('@/lib/locales/it.json'),
  ko: () => import('@/lib/locales/ko.json'),
  pl: () => import('@/lib/locales/pl.json'),
  pt: () => import('@/lib/locales/pt.json'),
  ru: () => import('@/lib/locales/ru.json'),
  sr: () => import('@/lib/locales/sr.json'),
  tr: () => import('@/lib/locales/tr.json'),
  zh: () => import('@/lib/locales/zh.json'),
};

export const defaultLocaleResources = { en: { translation: en } };

export const ensureI18nLocale = async (instance: I18nInstance, locale: string): Promise<void> => {
  if (locale === 'en' || instance.hasResourceBundle(locale, 'translation')) return;

  const load = localeLoaders[locale];
  if (!load) return;

  const mod = await load();
  instance.addResourceBundle(locale, 'translation', mod.default, true, true);
};

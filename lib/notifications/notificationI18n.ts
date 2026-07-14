import type { TFunction } from 'i18next';

import i18nCore from '@/lib/i18nCore';

export const createNotificationTranslator = (locale: string): TFunction =>
  i18nCore.getFixedT(locale, 'translation');

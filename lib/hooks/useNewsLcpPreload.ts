'use client';

import { useEffect } from 'react';
import { getNewsHeroImageSrc } from '@/lib/news/newsContent';
import type { HubNewsItem } from '@/lib/news/newsContent';

const preloaded = new Set<string>();

export const useNewsLcpPreload = (
  news: HubNewsItem[] | undefined,
  locale: string,
  enabled: boolean,
): void => {
  useEffect(() => {
    if (!enabled) return;

    const src = getNewsHeroImageSrc(news, locale);
    if (!src || preloaded.has(src)) return;

    preloaded.add(src);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }, [enabled, locale, news]);
};

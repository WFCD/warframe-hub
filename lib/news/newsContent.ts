import { getNewsImageSrc } from './newsImage';

export type HubNewsItem = {
  id: string;
  message?: string;
  imageLink?: string;
  link: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  translations: Record<string, string>;
};

export const getLocalizedNews = (news: HubNewsItem[], locale: string): HubNewsItem[] =>
  news.filter((item) => item.translations[locale]).reverse();

export const getFirstNewsHero = (
  news: HubNewsItem[] | undefined,
  locale: string,
): HubNewsItem | null => {
  const items = getLocalizedNews(news ?? [], locale);
  return items[0] ?? null;
};

export const getNewsHeroImageSrc = (
  news: HubNewsItem[] | undefined,
  locale: string,
): string | null => {
  const hero = getFirstNewsHero(news, locale);
  if (!hero) return null;
  return getNewsImageSrc(hero.imageLink);
};

import { cdn, optimize } from '@/lib/shared';

export const NEWS_PLACEHOLDER_PATH = 'img/news-placeholder.png';
export const NEWS_PLACEHOLDER_URL = cdn(NEWS_PLACEHOLDER_PATH);
export const NEWS_PLACEHOLDER_SRC = optimize(NEWS_PLACEHOLDER_URL, '404x110', 'scale');

const DEFAULT_NEWS_IMAGE_URLS = new Set([
  'https://i.imgur.com/CNrsc7V.png',
  NEWS_PLACEHOLDER_URL,
  `https://cdn.warframestat.us/genesis/${NEWS_PLACEHOLDER_PATH}`,
  `https://wfcd.github.io/genesis-assets/${NEWS_PLACEHOLDER_PATH}`,
]);

export const resolveNewsImageUrl = (url?: string | null): string => {
  const trimmed = url?.trim();
  if (!trimmed || DEFAULT_NEWS_IMAGE_URLS.has(trimmed)) {
    return NEWS_PLACEHOLDER_URL;
  }
  return trimmed;
};

export const getNewsImageSrc = (url?: string | null): string =>
  optimize(resolveNewsImageUrl(url), '404x110', 'scale');

import { readStorage, writeStorage } from '@/lib/providers/storageUtils';

const CACHE_KEY = 'hub.v1.cache.itemSearch';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

type ItemSearchCacheEntry = {
  imageName: string;
  fetchedAt: string;
};

type ItemSearchCache = Record<string, ItemSearchCacheEntry>;

const normalizeQuery = (query: string): string => query.trim().toLowerCase();

export const getCachedItemImageName = (query: string, at = Date.now()): string | null => {
  const key = normalizeQuery(query);
  if (!key) return null;

  const cache = readStorage<ItemSearchCache>(CACHE_KEY) ?? {};
  const entry = cache[key];
  if (!entry) return null;

  const age = at - Date.parse(entry.fetchedAt);
  if (Number.isNaN(age) || age > TTL_MS) return null;

  return entry.imageName;
};

export const setCachedItemImageName = (query: string, imageName: string): void => {
  const key = normalizeQuery(query);
  if (!key || !imageName) return;

  const cache = readStorage<ItemSearchCache>(CACHE_KEY) ?? {};
  cache[key] = { imageName, fetchedAt: new Date().toISOString() };
  writeStorage(CACHE_KEY, cache);
};

const inflight = new Map<string, Promise<string | null>>();

export const fetchItemImageName = async (query: string): Promise<string | null> => {
  const key = normalizeQuery(query);
  if (!key) return null;

  const cached = getCachedItemImageName(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async () => {
    try {
      const res = await fetch(`https://api.warframestat.us/items/search/${encodeURIComponent(key)}`);
      const data = (await res.json()) as { name: string; imageName?: string }[];
      const match = data.find((entry) => entry.name.toLowerCase() === key) ?? data[0];
      const imageName = match?.imageName ?? null;
      if (imageName) setCachedItemImageName(key, imageName);
      return imageName;
    } catch {
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
};

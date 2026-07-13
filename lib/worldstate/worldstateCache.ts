import type { Platform, WorldstateData } from '@/lib/shared';
import { readStorage, writeStorage } from '@/lib/providers/storageUtils';
import { getDataMode } from '../test/dataMode';
import { isPlaceholderWorldstate } from './worldstatePlaceholder';
import { isWorldstateStale, STALE_POLL_INTERVAL_MS, STALE_WORLDSTATE_MS } from './worldstateAge';

export type WorldstateCacheMeta = {
  fetchedAt: string;
  locale: string;
};

export const WORLDSTATE_POLL_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_INTERVAL ?? 30000);

export const wsMetaStorageKey = (platform: Platform) => `hub.v1.ws.meta.${platform}`;

export const readWorldstateCacheMeta = (platform: Platform): WorldstateCacheMeta | null =>
  readStorage<WorldstateCacheMeta>(wsMetaStorageKey(platform));

export const writeWorldstateCacheMeta = (platform: Platform, meta: WorldstateCacheMeta): void => {
  writeStorage(wsMetaStorageKey(platform), meta);
};

export const getCacheAgeMs = (fetchedAt?: string, at = Date.now()): number | null => {
  if (!fetchedAt) return null;
  const parsed = Date.parse(fetchedAt);
  if (Number.isNaN(parsed)) return null;
  return at - parsed;
};

export const getWorldstatePollIntervalMs = (worldstateTimestamp?: string, at = Date.now()): number =>
  isWorldstateStale(worldstateTimestamp, STALE_WORLDSTATE_MS, at)
    ? STALE_POLL_INTERVAL_MS
    : WORLDSTATE_POLL_INTERVAL_MS;

export const isWorldstateFetchDue = ({
  platform,
  worldstate,
  locale,
  fetchedAt,
  force = false,
  at = Date.now(),
}: {
  platform: Platform;
  worldstate: WorldstateData;
  locale: string;
  fetchedAt?: string;
  force?: boolean;
  at?: number;
}): boolean => {
  if (force) return true;
  if (getDataMode() !== 'live') return false;
  if (isPlaceholderWorldstate(worldstate)) return true;

  const meta = readWorldstateCacheMeta(platform);
  const resolvedFetchedAt = fetchedAt ?? meta?.fetchedAt;
  if (!resolvedFetchedAt) return true;
  if (meta?.locale && meta.locale !== locale) return true;

  const cacheAge = getCacheAgeMs(resolvedFetchedAt, at);
  if (cacheAge === null) return true;

  const pollInterval = getWorldstatePollIntervalMs(worldstate.timestamp, at);
  return cacheAge >= pollInterval;
};

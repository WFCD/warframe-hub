import type { WorldstateData } from '@/lib/shared';

/** Bundled seed + any persisted copy before first live fetch. */
export const PLACEHOLDER_WORLDSTATE_TIMESTAMP = '2000-01-01T01:00:00.000Z';

export const isPlaceholderWorldstate = (worldstate: WorldstateData): boolean => {
  const timestamp = worldstate.timestamp;
  if (!timestamp) return true;
  return timestamp.startsWith('2000-01-01');
};

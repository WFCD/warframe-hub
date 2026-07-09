export const STALE_WORLDSTATE_MS = 5 * 60 * 1000;

export const getWorldstateAgeMs = (timestamp?: string, at = Date.now()): number | null => {
  if (!timestamp) return null;
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) return null;
  return at - parsed;
};

export const isWorldstateStale = (
  timestamp?: string,
  thresholdMs = STALE_WORLDSTATE_MS,
  at = Date.now(),
): boolean => {
  const ageMs = getWorldstateAgeMs(timestamp, at);
  if (ageMs === null) return false;
  return ageMs > thresholdMs;
};

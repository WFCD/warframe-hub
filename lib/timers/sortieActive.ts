import dayjs from 'dayjs';

export const isActiveSortie = (sortie: unknown): boolean => {
  if (!sortie || typeof sortie !== 'object') return false;
  const s = sortie as { expiry?: string; missions?: unknown[]; variants?: unknown[] };
  const missions = s.variants?.length ? s.variants : s.missions;
  if (!missions?.length) return false;
  if (!s.expiry) return true;
  const expiry = dayjs(s.expiry);
  return expiry.isValid() && expiry.isAfter(dayjs());
};

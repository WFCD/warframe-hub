import dayjs from 'dayjs';

import { isRealInstant, parseInstant } from '@/lib/shared';

export const isActiveSortie = (sortie: unknown): boolean => {
  if (!sortie || typeof sortie !== 'object') return false;
  const s = sortie as { expiry?: string; missions?: unknown[]; variants?: unknown[] };
  const missions = s.variants?.length ? s.variants : s.missions;
  if (!missions?.length) return false;
  if (!s.expiry) return true;
  const expiry = parseInstant(s.expiry);
  if (!isRealInstant(expiry)) return false;
  return expiry.isAfter(dayjs());
};

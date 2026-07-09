import type { Platform } from './types/platform';

export type RivenTradeStat = {
  itemType: string;
  compatibility: string;
  rerolled: boolean;
  avg: number;
  stddev: number;
  min: number;
  max: number;
  pop: number;
  median: number;
};

/** Nested payload from `GET /{platform}/rivens` on api.warframestat.us */
export type RivenApiPayload = Record<
  string,
  Record<string, Partial<Record<'unrolled' | 'rerolled', RivenTradeStat>>>
>;

/** WFCD API platform slug (`switch` → `swi`). */
export const rivensApiPlatform = (platform: Platform): string => (platform === 'switch' ? 'swi' : platform);

export const flattenRivensApi = (payload: RivenApiPayload): RivenTradeStat[] => {
  const rows: RivenTradeStat[] = [];
  for (const byType of Object.values(payload)) {
    for (const byWeapon of Object.values(byType)) {
      for (const stat of Object.values(byWeapon)) {
        if (stat) rows.push(stat);
      }
    }
  }
  return rows;
};

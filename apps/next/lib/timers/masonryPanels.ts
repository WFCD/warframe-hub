import type { ComponentsMap } from '@wfcd/shared';

/** Panels rendered in the timers page masonry grid (not cycle-bar timers). */
export const MASONRY_PANEL_KEYS = [
  'construction',
  'darvo',
  'news',
  'event',
  'alerts',
  'invasions',
  'nightwave',
  'conclave',
  'sortie',
  'archonHunt',
  'fissures',
  'voidStorms',
  'steelPathFissures',
  'bounties',
  'solaris-bounties',
  'entrati-bounties',
  'deals',
  'baro',
] as const;

export type MasonryPanelKey = (typeof MASONRY_PANEL_KEYS)[number];

export const DEFAULT_MASONRY_PANEL_ORDER: MasonryPanelKey[] = [...MASONRY_PANEL_KEYS];

const masonryKeySet = new Set<string>(MASONRY_PANEL_KEYS);

export const isMasonryPanelKey = (key: string): key is MasonryPanelKey => masonryKeySet.has(key);

/** Merge stored order with defaults — keeps unknown keys, appends new panels. */
export const normalizeComponentOrder = (
  stored: string[] | undefined,
  components: ComponentsMap,
): MasonryPanelKey[] => {
  const displayableMasonryKeys = MASONRY_PANEL_KEYS.filter((key) => components[key]?.displayable !== false);
  const seen = new Set<string>();
  const ordered: MasonryPanelKey[] = [];

  for (const key of stored ?? []) {
    if (!isMasonryPanelKey(key) || seen.has(key)) continue;
    if (!displayableMasonryKeys.includes(key)) continue;
    ordered.push(key);
    seen.add(key);
  }

  for (const key of DEFAULT_MASONRY_PANEL_ORDER) {
    if (seen.has(key) || !displayableMasonryKeys.includes(key)) continue;
    ordered.push(key);
    seen.add(key);
  }

  return ordered;
};

import type { ComponentsMap } from '@wfcd/shared';

export const FISSURE_PANEL_KEYS = ['fissures', 'voidStorms', 'steelPathFissures'] as const;

export type FissurePanelKey = (typeof FISSURE_PANEL_KEYS)[number];

export const isFissureDisplayIncluded = (
  displays: string,
  kind: 'fissures' | 'storms' | 'steelPath',
): boolean => {
  const normalized = displays === 'fissures-storms' ? 'fissures-storms-steelPath' : displays;
  if (normalized === 'fissures-storms-steelPath') return true;
  switch (kind) {
    case 'fissures':
      return normalized === 'fissures' || normalized.startsWith('fissures-');
    case 'storms':
      return normalized.includes('storms');
    case 'steelPath':
      return normalized.includes('steelPath');
    default:
      return false;
  }
};

/** Expand legacy single fissures panel into three separate panel prefs. */
export const migrateFissurePanels = (
  storedComponents: ComponentsMap | undefined,
  defaults: ComponentsMap,
  fissureDisplays: string,
  componentOrder: string[] | undefined,
): { components: ComponentsMap; componentOrder: string[] } => {
  const components: ComponentsMap = { ...defaults, ...storedComponents };
  const needsComponentMigration = Boolean(storedComponents && !('voidStorms' in storedComponents));

  if (needsComponentMigration) {
    const baseDisplay = storedComponents?.fissures?.display ?? defaults.fissures?.display ?? true;
    components.fissures = {
      ...components.fissures,
      display: baseDisplay && isFissureDisplayIncluded(fissureDisplays, 'fissures'),
    };
    components.voidStorms = {
      ...components.voidStorms,
      display: baseDisplay && isFissureDisplayIncluded(fissureDisplays, 'storms'),
    };
    components.steelPathFissures = {
      ...components.steelPathFissures,
      display: baseDisplay && isFissureDisplayIncluded(fissureDisplays, 'steelPath'),
    };
  }

  let order = componentOrder ?? [];
  if (order.includes('fissures') && !order.includes('voidStorms')) {
    order = order.flatMap((key) => (key === 'fissures' ? [...FISSURE_PANEL_KEYS] : [key]));
  }

  return { components, componentOrder: order };
};

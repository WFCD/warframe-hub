import componentsJson from '@/data/json/components.json';
import planetsJson from '@/data/json/planets.json';
import { normalizePlatform, type ComponentsMap, type PrefsState } from '@/lib/shared';
import { buildTrackables } from '@/lib/data/buildTrackables';
import { DEFAULT_MASONRY_PANEL_ORDER, normalizeComponentOrder } from '@/lib/timers/masonryPanels';
import { migrateFissurePanels } from '@/lib/timers/fissurePanelMigration';
import { migrateLegacyStorage } from '@/lib/providers/legacyMigration';
import { readStorage } from '@/lib/providers/storageUtils';

export const PREFS_STORAGE_KEY = 'hub.v1.prefs';

/** SSR/hydration-safe defaults — locale/platform prefs hydrate in useLayoutEffect. */
export const createDefaultPrefsState = (): PrefsState => ({
  platform: 'pc',
  theme: 'night',
  locale: 'en',
  components: componentsJson as ComponentsMap,
  componentOrder: [...DEFAULT_MASONRY_PANEL_ORDER],
  trackables: { rewardTypes: {}, eventTypes: {} },
  fissurePlanets: planetsJson as PrefsState['fissurePlanets'],
  fissureDisplays: 'fissures-storms',
  soundFilters: [],
});

export const readHydratedPrefsState = (base = createDefaultPrefsState()): PrefsState => {
  if (typeof window === 'undefined') return base;

  migrateLegacyStorage();
  const stored = readStorage<PrefsState>(PREFS_STORAGE_KEY);
  const trackables = buildTrackables(stored?.trackables);

  if (!stored) {
    return {
      ...base,
      trackables,
      componentOrder: normalizeComponentOrder(undefined, base.components),
    };
  }

  const migrated = migrateFissurePanels(
    stored.components,
    base.components,
    stored.fissureDisplays ?? base.fissureDisplays,
    stored.componentOrder,
  );
  const components = migrated.components;
  const componentOrder = normalizeComponentOrder(migrated.componentOrder, components);

  return {
    ...base,
    ...stored,
    platform: normalizePlatform(stored.platform ?? base.platform),
    trackables,
    components,
    componentOrder,
  };
};

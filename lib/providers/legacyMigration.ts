import { normalizePlatform, type Platform } from '@/lib/shared';
import type { PrefsState } from '@/lib/shared';
import type { MapsState } from '@/lib/shared';
import type { NotificationsState } from '@/lib/shared';
import type { CacheState } from '@/lib/shared';
import type { WorldstateData } from '@/lib/shared';
import { readStorage, removeStorage, writeStorage } from './storageUtils';

type LegacyVuex = Partial<PrefsState & MapsState & NotificationsState & { worldstates?: Record<Platform, WorldstateData> }>;
type LegacyCache = Partial<CacheState>;

export const migrateLegacyStorage = (): void => {
  if (typeof window === 'undefined') return;
  if (readStorage('hub.v1.prefs')) return;

  const legacyRaw = window.localStorage.getItem('vuex');
  const cacheRaw = window.localStorage.getItem('cache');

  if (legacyRaw) {
    try {
      const legacy = JSON.parse(legacyRaw) as LegacyVuex & Record<string, unknown>;
      delete legacy.warframes;
      delete legacy.mods;
      delete legacy.weapons;
      delete legacy.synthData;
      delete legacy.rivens;

      const prefs: PrefsState = {
        platform: normalizePlatform(legacy.platform as string | undefined),
        theme: legacy.theme || 'night',
        locale: legacy.locale || 'en',
        components: legacy.components || {},
        componentOrder: [],
        trackables: legacy.trackables || { rewardTypes: {}, eventTypes: {} },
        fissurePlanets: legacy.fissurePlanets || {},
        fissureDisplays: legacy.fissureDisplays || 'fissures-storms',
        soundFilters: legacy.soundFilters || [],
      };
      writeStorage('hub.v1.prefs', prefs);

      const maps: MapsState = {
        poeMapToggles: legacy.poeMapToggles || {},
        vallisMapToggles: legacy.vallisMapToggles || {},
        deimosMapToggles: legacy.deimosMapToggles || {},
        bountyToggles: legacy.bountyToggles || {},
      };
      writeStorage('hub.v1.maps', maps);

      const notifications: NotificationsState = {
        notificationsAllowed: legacy.notificationsAllowed || 'default',
        notifiedIds: legacy.notifiedIds || { pc: [], ps4: [], xb1: [], switch: [] },
      };
      writeStorage('hub.v1.notifications', notifications);

      if (legacy.worldstates) {
        (Object.keys(legacy.worldstates) as Platform[]).forEach((platform) => {
          const ws = legacy.worldstates?.[platform];
          if (ws) writeStorage(`hub.v1.ws.${platform}`, ws);
        });
      }
    } catch {
      /* ignore corrupt legacy */
    }
    removeStorage('vuex');
  }

  if (cacheRaw) {
    try {
      const cache = JSON.parse(cacheRaw) as LegacyCache & { weaponds?: unknown[] };
      if (cache.rivens) writeStorage('hub.v1.cache.rivens', cache.rivens);
      if (cache.synthData) writeStorage('hub.v1.cache.synth', cache.synthData);
      if (cache.warframes) writeStorage('hub.v1.cache.codex.warframes', cache.warframes);
      if (cache.weapons || cache.weaponds) writeStorage('hub.v1.cache.codex.weapons', cache.weapons || cache.weaponds);
      if (cache.mods) writeStorage('hub.v1.cache.codex.mods', cache.mods);
    } catch {
      /* ignore */
    }
    removeStorage('cache');
  }
};

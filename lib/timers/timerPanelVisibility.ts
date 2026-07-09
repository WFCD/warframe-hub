import dayjs from 'dayjs';
import type { ComponentsMap, WorldstateData } from '@/lib/shared';
import type { MasonryPanelKey } from './masonryPanels';

export const isActiveSortie = (sortie: unknown): boolean => {
  if (!sortie || typeof sortie !== 'object') return false;
  const s = sortie as { expiry?: string; missions?: unknown[]; variants?: unknown[] };
  const missions = s.variants?.length ? s.variants : s.missions;
  if (!missions?.length) return false;
  if (!s.expiry) return true;
  const expiry = dayjs(s.expiry);
  return expiry.isValid() && expiry.isAfter(dayjs());
};

type SyndicateLookup = {
  ostron?: { id: string };
  solaris?: { id: string };
  entrati?: { id: string };
};

export const isTimerPanelVisible = (
  key: MasonryPanelKey,
  components: ComponentsMap,
  worldstate: WorldstateData,
  syndicates: SyndicateLookup,
): boolean => {
  const config = components[key];
  if (!config?.display) return false;

  switch (key) {
    case 'event':
      return ((worldstate.events as unknown[] | undefined) ?? []).length > 0;
    case 'sortie':
      return Boolean(worldstate.sortie && isActiveSortie(worldstate.sortie));
    case 'archonHunt':
      return Boolean(worldstate.archonHunt && isActiveSortie(worldstate.archonHunt));
    case 'bounties':
      return Boolean(syndicates.ostron);
    case 'solaris-bounties':
      return Boolean(syndicates.solaris);
    case 'entrati-bounties':
      return Boolean(syndicates.entrati);
    default:
      return true;
  }
};

import type { PrefsState, WorldstateData } from '@/lib/shared';
import type { MasonryPanelKey } from './masonryPanels';
import { isPlaceholderWorldstate } from '../worldstate/worldstatePlaceholder';
import { hasTimerPanelContent } from './timerPanelContent';

type SyndicateLookup = {
  ostron?: { id: string };
  solaris?: { id: string };
  entrati?: { id: string };
};

/** True once live worldstate (or cache) is available for this panel slice. */
export const isTimerPanelDataReady = (
  key: MasonryPanelKey,
  worldstate: WorldstateData,
  syndicates: SyndicateLookup,
): boolean => {
  if (isPlaceholderWorldstate(worldstate)) return false;

  switch (key) {
    case 'sortie':
      return Boolean(worldstate.sortie);
    case 'archonHunt':
      return Boolean(worldstate.archonHunt);
    case 'bounties':
      return Boolean(syndicates.ostron);
    case 'solaris-bounties':
      return Boolean(syndicates.solaris);
    case 'entrati-bounties':
      return Boolean(syndicates.entrati);
    case 'construction':
      return worldstate.constructionProgress != null;
    default:
      return true;
  }
};

/** Panels that should mount and load chunks — enabled in prefs and have content. */
export const shouldRenderTimerPanelContent = (
  key: MasonryPanelKey,
  worldstate: WorldstateData,
  syndicates: SyndicateLookup,
  fissurePlanets?: PrefsState['fissurePlanets'],
): boolean => {
  if (!isTimerPanelDataReady(key, worldstate, syndicates)) return false;
  return hasTimerPanelContent(key, worldstate, syndicates, fissurePlanets);
};

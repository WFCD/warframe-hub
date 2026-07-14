import type { ComponentsMap, PrefsState, WorldstateData } from '@/lib/shared';
import type { MasonryPanelKey } from './masonryPanels';
import { isPlaceholderWorldstate } from '../worldstate/worldstatePlaceholder';
import { hasFissuresForPanel, type WorldstateFissure } from './fissurePanelContent';
import { hasActiveEvents } from './eventPanelContent';
import { isActiveSortie } from './sortieActive';

type SyndicateLookup = {
  ostron?: { id: string };
  solaris?: { id: string };
  entrati?: { id: string };
};

const hasItems = (value: unknown): boolean => Array.isArray(value) && value.length > 0;

/** True when worldstate has rows worth rendering for this panel. */
export const hasTimerPanelContent = (
  key: MasonryPanelKey,
  worldstate: WorldstateData,
  syndicates: SyndicateLookup,
  fissurePlanets?: PrefsState['fissurePlanets'],
): boolean => {
  const fissures = worldstate.fissures as WorldstateFissure[] | undefined;

  switch (key) {
    case 'event':
      return hasActiveEvents(worldstate.events);
    case 'news':
      return hasItems(worldstate.news);
    case 'alerts':
      return hasItems(worldstate.alerts);
    case 'invasions':
      return hasItems(worldstate.invasions);
    case 'fissures':
      return hasFissuresForPanel(fissures, 'fissures', fissurePlanets);
    case 'voidStorms':
      return hasFissuresForPanel(fissures, 'voidStorms', fissurePlanets);
    case 'steelPathFissures':
      return hasFissuresForPanel(fissures, 'steelPathFissures', fissurePlanets);
    case 'darvo':
      return hasItems(worldstate.dailyDeals);
    case 'deals':
      return hasItems(worldstate.flashSales);
    case 'nightwave':
      return hasItems((worldstate.nightwave as { activeChallenges?: unknown[] } | undefined)?.activeChallenges);
    case 'construction':
      return worldstate.constructionProgress != null;
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
    case 'baro':
      return Boolean(worldstate.voidTrader);
    case 'conclave':
      return hasItems(worldstate.conclaveChallenges);
    default:
      return false;
  }
};

export const isTimerPanelVisible = (
  key: MasonryPanelKey,
  components: ComponentsMap,
  worldstate: WorldstateData,
  syndicates: SyndicateLookup,
  fissurePlanets?: PrefsState['fissurePlanets'],
): boolean => {
  if (!components[key]?.display) return false;
  if (isPlaceholderWorldstate(worldstate)) return false;
  return hasTimerPanelContent(key, worldstate, syndicates, fissurePlanets);
};

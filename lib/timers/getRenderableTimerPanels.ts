import type { ComponentsMap, PrefsState, WorldstateData } from '@/lib/shared';
import type { MasonryPanelKey } from './masonryPanels';
import { shouldRenderTimerPanelContent } from './isTimerPanelDataReady';
import { isTimerPanelVisible } from './timerPanelContent';

type SyndicateLookup = {
  ostron?: { id: string };
  solaris?: { id: string };
  entrati?: { id: string };
};

export const getActiveTimerPanelKeys = (
  order: MasonryPanelKey[],
  components: ComponentsMap,
): MasonryPanelKey[] => order.filter((key) => components[key]?.display);

export const getRenderableTimerPanelKeys = (
  order: MasonryPanelKey[],
  components: ComponentsMap,
  worldstate: WorldstateData,
  syndicates: SyndicateLookup,
  fissurePlanets?: PrefsState['fissurePlanets'],
): MasonryPanelKey[] =>
  getActiveTimerPanelKeys(order, components).filter((key) =>
    isTimerPanelVisible(key, components, worldstate, syndicates, fissurePlanets),
  );

export const canLoadTimerPanelChunk = (
  key: MasonryPanelKey,
  worldstate: WorldstateData,
  syndicates: SyndicateLookup,
  fissurePlanets?: PrefsState['fissurePlanets'],
): boolean => shouldRenderTimerPanelContent(key, worldstate, syndicates, fissurePlanets);

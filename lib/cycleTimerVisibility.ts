import { isArbitrationActive, type ComponentsMap, type WorldstateData } from '@/lib/shared';

export const shouldShowCycleTimers = (
  components: ComponentsMap,
  worldstate: WorldstateData
): boolean =>
  Boolean(
    components.aggregated?.display &&
      (components.cetus?.display ||
        components.vallis?.display ||
        components.cambion?.display ||
        components.reset?.display ||
        components.zariman?.display ||
        components.sentientoutposts?.display ||
        components['steel-path']?.display ||
        (components.arbitration?.display && isArbitrationActive(worldstate.arbitration)))
  );

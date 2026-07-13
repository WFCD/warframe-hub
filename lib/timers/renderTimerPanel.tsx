import type { ComponentsMap, WorldstateData } from '@/lib/shared';
import type { MasonryPanelKey } from './masonryPanels';

type SyndicateMission = { id: string };

export type TimerPanelRenderContext = {
  panelKey: MasonryPanelKey;
  worldstate: WorldstateData;
  components: ComponentsMap;
  ostron?: SyndicateMission;
  solaris?: SyndicateMission;
  entrati?: SyndicateMission;
};

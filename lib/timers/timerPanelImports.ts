import type { MasonryPanelKey } from './masonryPanels';
import type { TimerPanelComponent } from './timerPanelTypes';
import { loadTimerPanelChunk } from './panelChunkQueue';

export type { TimerPanelComponent } from './timerPanelTypes';

export const loadTimerPanelComponent = (key: MasonryPanelKey): Promise<TimerPanelComponent> =>
  loadTimerPanelChunk(key);

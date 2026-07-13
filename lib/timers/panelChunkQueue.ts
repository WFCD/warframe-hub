import type { MasonryPanelKey } from './masonryPanels';
import type { TimerPanelComponent } from './timerPanelTypes';
import { panelChunkLoaders } from './panelChunkLoaders';

let queue: Promise<void> = Promise.resolve();

const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
};

export const loadTimerPanelChunk = (key: MasonryPanelKey): Promise<TimerPanelComponent> => {
  const loader = panelChunkLoaders[key];
  if (!loader) {
    throw new Error(`Unknown timer panel chunk: ${key}`);
  }
  return enqueue(loader);
};

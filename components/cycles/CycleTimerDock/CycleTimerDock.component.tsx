'use client';

import type { FC } from 'react';
import type { WorldstateData } from '@/lib/shared';
import CycleTimers from '@/components/cycles/CycleTimers';

type CycleTimerDockProps = {
  worldstate: WorldstateData;
};

const CycleTimerDock: FC<CycleTimerDockProps> = ({ worldstate }: CycleTimerDockProps) => (
  <div className="hub-panel-surface sticky top-[var(--hub-cycle-bar-sticky-top)] z-[calc(var(--hub-z-navbar,40)-1)] w-full max-w-full min-w-0 m-0 py-1.5 px-3 box-border rounded-[var(--hub-navbar-radius)] overflow-x-clip">
    <CycleTimers worldstate={worldstate} />
  </div>
);

export default CycleTimerDock;

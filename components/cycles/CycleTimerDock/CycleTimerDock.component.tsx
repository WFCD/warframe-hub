'use client';
import './CycleTimerDock.component.scss';

import type { FC } from 'react';
import type { WorldstateData } from '@/lib/shared';
import CycleTimers from '@/components/cycles/CycleTimers';

type CycleTimerDockProps = {
  worldstate: WorldstateData;
};

const CycleTimerDock: FC<CycleTimerDockProps> = ({ worldstate }: CycleTimerDockProps) => (
  <div className="hub-cycle-timers-bar hub-panel-surface">
    <CycleTimers worldstate={worldstate} />
  </div>
);

export default CycleTimerDock;

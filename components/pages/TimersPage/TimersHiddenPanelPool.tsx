'use client';

import type { FC, ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { HIDDEN_POOL_DROPPABLE_ID } from '@/lib/timers/panelLayout';

type TimersHiddenPanelPoolProps = {
  children: ReactNode;
  count: number;
};

const TimersHiddenPanelPool: FC<TimersHiddenPanelPoolProps> = ({ children, count }: TimersHiddenPanelPoolProps) => {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: HIDDEN_POOL_DROPPABLE_ID });

  return (
    <section
      ref={setNodeRef}
      className={['hub-timers-hidden-pool', isOver ? 'hub-timers-hidden-pool--over' : ''].filter(Boolean).join(' ')}
      aria-label={t('timersLayout.hiddenPanels')}
    >
      <header className='hub-timers-hidden-pool-header'>
        <h2 className='hub-timers-hidden-pool-title'>{t('timersLayout.hiddenPanels')}</h2>
        <p className='hub-timers-hidden-pool-hint'>
          {count === 0 ? t('timersLayout.hiddenEmptyHint') : t('timersLayout.hiddenRestoreHint')}
        </p>
      </header>
      <div className='hub-timers-hidden-strip'>{children}</div>
    </section>
  );
};

export default TimersHiddenPanelPool;

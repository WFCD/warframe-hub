'use client';

import type { FC } from 'react';
import { Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type TimerPanelPlaceholderProps = {
  label: string;
  compact?: boolean;
};

const TimerPanelPlaceholder: FC<TimerPanelPlaceholderProps> = ({
  label,
  compact = false,
}: TimerPanelPlaceholderProps) => {
  const { t } = useTranslation();

  return (
    <Card
      className={[
        'hub-panel-surface',
        'binpacker-item',
        'hub-timer-panel-placeholder',
        compact ? 'hub-timer-panel-placeholder--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Card.Content className="hub-timer-panel-placeholder-body">
        <span className="hub-timer-panel-placeholder-label">{label}</span>
        {!compact ? <p className="hub-timer-panel-placeholder-hint">{t('timersLayout.placeholderHint')}</p> : null}
      </Card.Content>
    </Card>
  );
};

export default TimerPanelPlaceholder;

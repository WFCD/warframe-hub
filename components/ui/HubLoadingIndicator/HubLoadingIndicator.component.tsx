'use client';

import type { FC } from 'react';

import { useTranslation } from 'react-i18next';
import HubLoadingIcon from './HubLoadingIcon.component';
import './HubLoadingIndicator.component.scss';

type HubLoadingIndicatorProps = {
  label?: string;
  className?: string;
  compact?: boolean;
};

const HubLoadingIndicator: FC<HubLoadingIndicatorProps> = ({
  label,
  className,
  compact = false,
}: HubLoadingIndicatorProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={['hub-loading-indicator', compact ? 'hub-loading-indicator--compact' : '', className]
        .filter(Boolean)
        .join(' ')}
      role='status'
      aria-live='polite'
      aria-label={label ?? t('time.loading')}
    >
      <HubLoadingIcon className='hub-loading-indicator__icon' />
      {label ? <p className='hub-loading-indicator__label'>{label}</p> : null}
    </div>
  );
};

export default HubLoadingIndicator;

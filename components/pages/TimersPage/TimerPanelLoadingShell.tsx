'use client';

import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import HubLoadingIndicator from '@/components/ui/HubLoadingIndicator';

type TimerPanelLoadingShellProps = {
  label: string;
};

const TimerPanelLoadingShell: FC<TimerPanelLoadingShellProps> = ({ label }: TimerPanelLoadingShellProps) => {
  const { t } = useTranslation();

  return (
    <HubPanelWrap title={label} className="hub-timer-panel-loading">
      <HubLoadingIndicator compact label={t('timersPage.panelLoading')} />
    </HubPanelWrap>
  );
};

export default TimerPanelLoadingShell;

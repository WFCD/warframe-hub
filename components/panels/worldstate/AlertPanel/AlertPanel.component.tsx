'use client';
import './AlertPanel.component.scss';
import type { FC } from 'react';

import { Chip } from '@heroui/react';
import { Trans, useTranslation } from 'react-i18next';
import { cdn } from '@/lib/shared';
import TimeBadge from '@/components/ui/TimeBadge';
import HubImg from '@/components/media/HubImg';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';

const archwing = cdn('svg/archwing.svg');
const nightmare = cdn('svg/nightmare.svg');

type AlertMission = {
  node: string;
  type: string;
  faction: string;
  minEnemyLevel: number;
  maxEnemyLevel: number;
  archwingRequired?: boolean;
  nightmare?: boolean;
  reward: {
    items: string[];
    countedItems: { key: string; type: string; count: number }[];
    credits?: number;
  };
};

type Alert = {
  id: string;
  activation: string;
  expiry: string;
  mission: AlertMission;
};

type AlertPanelProps = {
  alerts?: Alert[];
};

const AlertItem: FC<{ alert: Alert; last: boolean }> = ({ alert, last }: { alert: Alert; last: boolean }) => {
  const { t } = useTranslation();
  const { reward } = alert.mission;
  const hasRewards =
    reward.items.length > 0 || reward.countedItems.length > 0 || Boolean(reward.credits);

  if (new Date(alert.activation).getTime() >= Date.now()) return null;

  return (
    <HubPanelListItem style={{ display: 'block' }} borderless={!last} borderBottom={last} compact={!last}>
      <div className='hub-panel-row'>
        <span className='hub-panel-row-main'>
          {alert.mission.archwingRequired && (
            <HubImg src={archwing} name={t('alerts.archwing')} className='li-mission-decorator' />
          )}
          {alert.mission.nightmare && (
            <HubImg src={nightmare} name={t('alerts.nightmare')} className='li-mission-decorator' />
          )}
          <b>{alert.mission.node}</b>
        </span>
        <span className='hub-panel-row-side'>
          <TimeBadge starttime={alert.activation} endtime={alert.expiry} interval={1000} pullright={false} />
        </span>
      </div>
      <div className='hub-panel-row hub-panel-row-subtle'>
        <div className='hub-panel-row-main'>
          <Trans
            i18nKey='alerts.missionSummary'
            values={{
              type: alert.mission.type,
              faction: alert.mission.faction,
              levelLabel: t('alerts.level'),
              min: alert.mission.minEnemyLevel,
              max: alert.mission.maxEnemyLevel,
            }}
            components={{ type: <b />, level: <b /> }}
          />
        </div>
      </div>
      {hasRewards ? (
        <div className='hub-alert-rewards'>
          {reward.items.map((item) => (
            <Chip key={item} color='accent' size='sm' variant='soft'>
              {item}
            </Chip>
          ))}
          {reward.countedItems.map((item) => (
            <Chip key={item.key} color='accent' size='sm' variant='soft'>
              {item.count} {item.type}
            </Chip>
          ))}
          {reward.credits ? (
            <Chip color='accent' size='sm' variant='soft'>
              {reward.credits}cr
            </Chip>
          ) : null}
        </div>
      ) : null}
    </HubPanelListItem>
  );
};

const AlertPanel: FC<AlertPanelProps> = ({ alerts = [] }: AlertPanelProps) => {
  const { t } = useTranslation();
  const headertext = t('alerts.header');

  return (
    <HubPanelWrap title={headertext} className={alerts.length === 0 ? 'no-content' : 'alerts'}>
      <HubPanelList>
        {alerts.map((alert, index) => (
          <AlertItem key={alert.id} alert={alert} last={index === alerts.length - 1} />
        ))}
        {alerts.length === 0 && <NoDataItem text={headertext} />}
      </HubPanelList>
    </HubPanelWrap>
  );
};

export default AlertPanel;

'use client';

import { useEffect, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMaps } from '@/lib/providers/MapsProvider';
import BountyJobsTable, { type BountyJobsTableRow } from '@/components/panels/shared/BountyJobsTable';
import HubSwitch from '@/components/ui/HubSwitch';
import TimeBadge from '@/components/ui/TimeBadge';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';

type BountyJob = {
  type: string;
  standingStages: number[];
  enemyLevels: number[];
  rewardPool?: string[];
};

type Syndicate = {
  activation?: string;
  expiry?: string;
  jobs?: BountyJob[];
};

type BountyPanelProps = {
  syndicate?: Syndicate;
  type?: string;
};

const BountyPanel: FC<BountyPanelProps> = ({ syndicate = {}, type = 'Syndicate' }: BountyPanelProps) => {
  const { t } = useTranslation();
  const { state, dispatch } = useMaps();
  const typeId = type.toLowerCase().replace(/\s/gi, '-');

  const active = useMemo(
    () =>
      syndicate?.activation && syndicate?.expiry
        ? new Date(syndicate.activation).getTime() < Date.now() && new Date(syndicate.expiry).getTime() > Date.now()
        : false,
    [syndicate.activation, syndicate.expiry]
  );

  const [autoExpand, setAutoExpand] = useState(state.bountyToggles[typeId] ?? false);
  const [rows, setRows] = useState<BountyJobsTableRow[]>([]);

  useEffect(() => {
    setAutoExpand(state.bountyToggles[typeId] ?? false);
  }, [state.bountyToggles, typeId]);

  const headertext = t('bounty.header', { type: t(`timer.${typeId}`) });

  useEffect(() => {
    setRows(
      (syndicate.jobs || []).map((job) => ({
        type: job.type,
        standing: job.standingStages.reduce((a, b) => a + b, 0) || 0,
        levelRange: `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
        rewards: job.rewardPool || [],
        showDetails: autoExpand,
      }))
    );
  }, [syndicate.jobs, autoExpand]);

  const toggleDetails = (index: number) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, showDetails: !row.showDetails } : row)));
  };

  const toggleAutoExpand = () => {
    const next = !autoExpand;
    setAutoExpand(next);
    dispatch({ type: 'SET_BOUNTY_TOGGLE', payload: [typeId, next] });
  };

  return (
    <HubPanelWrap title={headertext} className='bounties'>
      {active ? (
        <div className='hub-bounty-panel'>
          <div className='hub-bounty-expiry hub-panel-row'>
            <span className='hub-panel-row-main'>{t('bounty.expires')}</span>
            <TimeBadge
              className='hub-panel-row-side'
              starttime={syndicate.activation!}
              endtime={syndicate.expiry!}
              interval={1000}
            />
          </div>

          <BountyJobsTable
            rows={rows}
            rowKeyPrefix={typeId}
            ariaLabel={headertext}
            onToggleRow={toggleDetails}
          />

          <div className='hub-bounty-footer'>
            <HubSwitch
              id={`${typeId}-bounty-reward-checkbox`}
              label={t('bounty.autoExpand')}
              checked={autoExpand}
              onChange={() => toggleAutoExpand()}
            />
          </div>
        </div>
      ) : (
        <NoDataItem text={headertext} />
      )}
    </HubPanelWrap>
  );
};

export default BountyPanel;

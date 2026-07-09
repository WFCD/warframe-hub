'use client';
import './NightwavePanel.component.scss';
import type { FC } from 'react';

import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { cdn } from '@wfcd/shared';
import TimeBadge from '@/components/ui/TimeBadge';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import HubImg from '@/components/media/HubImg';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';

const daily = cdn('webp/nightwave/daily.webp');
const weekly = cdn('webp/nightwave/weekly.webp');
const elite = cdn('webp/nightwave/elite.webp');
const standing = cdn('svg/standing.svg');

type NightwaveChallenge = {
  id: string;
  title: string;
  desc: string;
  activation: string;
  expiry: string;
  isDaily?: boolean;
  isElite?: boolean;
  reputation: number;
};

type Nightwave = {
  activeChallenges?: NightwaveChallenge[];
};

type NightwavePanelProps = {
  nightwave?: Nightwave;
};

const NightwavePanel: FC<NightwavePanelProps> = ({ nightwave }: NightwavePanelProps) => {
  const { t } = useTranslation();
  const headertext = t('nightwave.header');
  const challenges = nightwave?.activeChallenges ?? [];

  const type = (challenge: NightwaveChallenge) =>
    t(`nightwave.${challenge.isDaily ? 'daily' : challenge.isElite ? 'elite' : 'weekly'}`);

  return (
    <HubPanelWrap title={headertext} className="nightwave">
      {challenges.length > 0 ? (
        <HubPanelList>
          {challenges.map((challenge, index) => (
            <HubPanelListItem
              key={challenge.id}
              borderless={index !== challenges.length - 1}
              borderBottom={index === challenges.length - 1}
              compact={index !== challenges.length - 1}
            >
              <div className="hub-panel-row">
                <span className="hub-panel-row-main" title={challenge.desc}>
                  <HubImg
                    src={challenge.isDaily ? daily : challenge.isElite ? elite : weekly}
                    name={type(challenge)}
                    className="li-mission-decorator li-mission-decorator-lg invert"
                    height={challenge.isDaily ? '15px' : '24px'}
                    width={challenge.isDaily ? '15px' : '24px'}
                  />
                  {challenge.title}
                </span>
                <span className="hub-panel-row-side">
                  <TimeBadge
                    starttime={challenge.activation}
                    endtime={challenge.expiry}
                    interval={1000}
                    pullright={false}
                  />
                  <Chip
                    color={challenge.isDaily ? 'success' : challenge.isElite ? 'danger' : 'warning'}
                    size="sm"
                    variant="soft"
                    className="hub-standing-chip"
                  >
                    <HubImg src={standing} name="Standing Gain" className="invert" height="12px" width="12px" />
                    {challenge.reputation}
                  </Chip>
                </span>
              </div>
            </HubPanelListItem>
          ))}
        </HubPanelList>
      ) : (
        <NoDataItem text={headertext} />
      )}
    </HubPanelWrap>
  );
};

export default NightwavePanel;

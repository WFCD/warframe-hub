'use client';
import type { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { cdn } from '@/lib/shared';
import TimeBadge from '@/components/ui/TimeBadge';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import HubImg from '@/components/media/HubImg';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';

const conclaveimg = cdn('webp/conclave/conclave.webp');
const lunaro = cdn('webp/conclave/lunaro.webp');
const cephaloncapture = cdn('webp/conclave/cephaloncapture.webp');
const annihilation = cdn('webp/conclave/annihilation.webp');
const teamannihilation = cdn('webp/conclave/teamannihilation.webp');

type ConclaveChallenge = {
  id: string;
  description: string;
  asString?: string;
  activation: string;
  expiry: string;
  mode?: string;
  category?: string;
  rootChallenge?: boolean;
};

type ConclavePanelProps = {
  conclave?: ConclaveChallenge[];
};

const ConclavePanel: FC<ConclavePanelProps> = ({ conclave = [] }: ConclavePanelProps) => {
  const { t } = useTranslation();
  const headertext = t('conclave.header');

  const activeChallenges = conclave
    .filter((c) => !c.rootChallenge)
    .sort((a, b) => (a.category === 'week' || b.category === 'week' ? 1 : (a.mode ?? '').localeCompare(b.mode ?? '')));

  const challengeType = (challenge: ConclaveChallenge) => {
    if (challenge.mode === 'Team Annihilation') return t('conclave.teamannihilation');
    if (challenge.mode === 'Annihilation') return t('conclave.annihilation');
    if (challenge.mode === 'Capture the Cephalon') return t('conclave.cephaloncapture');
    if (challenge.mode === 'Lunaro') return t('conclave.lunaro');
    if (challenge.category === 'week') return t('conclave.weekly');
    return t('conclave.header');
  };

  const challengeImage = (challenge: ConclaveChallenge) => {
    if (challenge.mode === 'Team Annihilation') return teamannihilation;
    if (challenge.mode === 'Annihilation') return annihilation;
    if (challenge.mode === 'Capture the Cephalon') return cephaloncapture;
    if (challenge.mode === 'Lunaro') return lunaro;
    return conclaveimg;
  };

  return (
    <HubPanelWrap title={headertext} className="conclave">
      {activeChallenges.length > 0 ? (
        <HubPanelList>
          {activeChallenges.map((challenge, index) => (
            <HubPanelListItem
              key={challenge.id}
              style={{ display: 'block' }}
              borderless={index !== activeChallenges.length - 1}
              borderBottom={index === activeChallenges.length - 1}
              compact={index !== activeChallenges.length - 1}
            >
              <div className="hub-panel-row">
                <span title={challenge.asString} className="hub-panel-row-main">
                  <HubImg
                    src={challengeImage(challenge)}
                    name={challengeType(challenge)}
                    className="li-mission-decorator li-mission-decorator-lg"
                    height="24px"
                    width="24px"
                  />
                  {challenge.description}
                </span>
                <span className="hub-panel-row-side">
                  <TimeBadge
                    starttime={challenge.activation}
                    endtime={challenge.expiry}
                    interval={1000}
                    pullright={false}
                  />
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

export default ConclavePanel;

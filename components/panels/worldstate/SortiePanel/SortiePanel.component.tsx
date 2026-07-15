'use client';
import './SortiePanel.component.scss';
import type { FC } from 'react';

import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { cdn } from '@/lib/shared';
import HubImg from '@/components/media/HubImg';
import TimeBadge from '@/components/ui/TimeBadge';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');
const narmer = cdn('svg/factions/narmer2.svg');

const fImg: Record<string, string> = {
  corpus,
  grineer,
  infested,
  infestation: infested,
  corrupted,
  orokin: corrupted,
  sentient,
  narmer,
};

type SortieMission = {
  missionType?: string;
  type?: string;
  node: string;
  modifier: string;
  modifierDescription?: string;
};

type Sortie = {
  faction?: string;
  boss?: string;
  expiry?: string;
  missions?: SortieMission[];
  variants?: SortieMission[];
};

type SortiePanelProps = {
  sortie?: Sortie;
};

const SortiePanel: FC<SortiePanelProps> = ({ sortie = {} }: SortiePanelProps) => {
  const { t } = useTranslation();
  const missions = (sortie.variants?.length ? sortie.variants : sortie.missions) || [];
  const headertext = sortie.missions?.length ? t('sortie.hunt.header') : t('sortie.header');
  const factionImg = fImg[sortie.faction?.toLowerCase() ?? ''] || corrupted;
  const now = dayjs().toISOString();

  return (
    <HubPanelWrap title={headertext} className='sortie'>
      <HubPanelList>
        <HubPanelListItem borderless compact>
          <div className='hub-panel-row'>
            <span className='hub-panel-row-main'>
              <h3 className='my-0 inline-flex items-center gap-1.5'>
                <HubImg
                  src={factionImg}
                  name={sortie.faction ?? ''}
                  className='li-mission-decorator li-mission-decorator-lg invert shrink-0'
                  width='25px'
                  height='25px'
                />
                {sortie.boss}
              </h3>
            </span>
            <span className='hub-panel-row-side'>
              <TimeBadge starttime={now} endtime={sortie.expiry} interval={1000} pullright={false} />
            </span>
          </div>
        </HubPanelListItem>
        {missions.map((mission, index) => (
          <HubPanelListItem
            key={`sortie-${index}`}
            borderless={index !== missions.length - 1}
            borderBottom={index === missions.length - 1}
            compact={index !== missions.length - 1}
          >
            <div className='hub-sortie-mission ml-3'>
              <div className='hub-panel-row hub-panel-row-subtle'>
                <span className='hub-panel-row-main'>
                  <b>
                    {mission.missionType || mission.type} - {mission.node}
                  </b>
                </span>
                <span className='hub-panel-row-side' title={mission.modifierDescription}>
                  {mission.modifier}
                </span>
              </div>
            </div>
          </HubPanelListItem>
        ))}
      </HubPanelList>
    </HubPanelWrap>
  );
};

export default SortiePanel;

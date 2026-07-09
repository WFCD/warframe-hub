'use client';
import './FissuresPanel.component.scss';

import { useMemo, type FC } from 'react';
import { Tooltip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { cdn } from '@wfcd/shared';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import TimeBadge from '@/components/ui/TimeBadge';
import HubImg from '@/components/media/HubImg';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';
import OmniaFissureIcon, { fissureTierIcon, isOmniaFissure } from './OmniaFissureIcon.component';
import type { FissurePanelKey } from '@/lib/timers/fissurePanelMigration';

const archwing = cdn('svg/archwing.svg');
const steelPath = cdn('svg/sp-logo.svg');

const VARIANT_CLASS: Record<FissurePanelKey, string> = {
  fissures: 'fissures',
  voidStorms: 'void-storms',
  steelPathFissures: 'steel-path-fissures',
};

const VARIANT_TITLE_KEY: Record<FissurePanelKey, string> = {
  fissures: 'fissures.header',
  voidStorms: 'fissures.voidStorms',
  steelPathFissures: 'fissures.steelPathFissures',
};

type Fissure = {
  id: string;
  node: string;
  missionType: string;
  tier: string;
  tierNum: number;
  activation: string;
  expiry: string;
  expired?: boolean;
  isStorm?: boolean;
  isHard?: boolean;
};

type FissuresPanelProps = {
  fissures?: Fissure[];
  variant?: FissurePanelKey;
};

const matchesVariant = (fissure: Fissure, variant: FissurePanelKey): boolean => {
  if (fissure.expired) return false;
  if (variant === 'voidStorms') return Boolean(fissure.isStorm);
  if (variant === 'steelPathFissures') return Boolean(fissure.isHard);
  return !fissure.isStorm && !fissure.isHard;
};

const FissuresPanel: FC<FissuresPanelProps> = ({ fissures = [], variant = 'fissures' }: FissuresPanelProps) => {
  const { t } = useTranslation();
  const { state } = usePrefs();
  const headertext = t(VARIANT_TITLE_KEY[variant]);

  const filteredFissures = useMemo(() => {
    const pState: string[] = [];
    Object.keys(state.fissurePlanets).forEach((p) => {
      if (state.fissurePlanets[p].state) pState.push(p);
    });
    const planets = new RegExp(`(${pState.join('|')})`, 'i');

    return fissures
      .filter((fissure) => {
        const isFiltered = planets.test(fissure.node);
        return (pState.length > 0 ? !isFiltered : true) && matchesVariant(fissure, variant);
      })
      .sort((a, b) => {
        if (a.tierNum < b.tierNum) return -1;
        if (a.tierNum > b.tierNum) return 1;
        return 0;
      });
  }, [fissures, state.fissurePlanets, variant]);

  const titleAddon =
    variant === 'voidStorms' ? (
      <HubImg
        src={archwing}
        name={t('fissures.voidstorm')}
        className="hub-panel-title-icon li-mission-decorator li-mission-decorator-lg"
        height="24px"
        width="24px"
      />
    ) : variant === 'steelPathFissures' ? (
      <HubImg
        src={steelPath}
        name={t('fissures.steelPath')}
        className="hub-panel-title-icon li-mission-decorator li-mission-decorator-lg no-invert"
        height="24px"
        width="24px"
      />
    ) : undefined;

  return (
    <HubPanelWrap title={headertext} titleAddon={titleAddon} className={VARIANT_CLASS[variant]}>
      <HubPanelList>
        {filteredFissures.map((fissure, index) => (
          <HubPanelListItem
            key={fissure.id}
            borderless={index !== filteredFissures.length - 1}
            compact={index !== filteredFissures.length - 1}
          >
            <div className="hub-panel-row">
              <span className="hub-panel-row-main hub-inline-row">
                <Tooltip delay={400}>
                  <Tooltip.Trigger>
                    {isOmniaFissure(fissure) ? (
                      <OmniaFissureIcon
                        label={fissure.tier}
                        className="li-mission-decorator li-mission-decorator-lg hub-fissure-tier-icon"
                      />
                    ) : (
                      <HubImg
                        src={fissureTierIcon(fissure)}
                        name={fissure.tier}
                        showTitle={false}
                        className="li-mission-decorator li-mission-decorator-lg hub-fissure-tier-icon"
                        height="24px"
                        width="24px"
                      />
                    )}
                  </Tooltip.Trigger>
                  <Tooltip.Content>{fissure.tier}</Tooltip.Content>
                </Tooltip>
                <span>
                  <b>{fissure.node}</b> | {fissure.missionType}
                </span>
              </span>
              <span className="hub-panel-row-side">
                <TimeBadge
                  starttime={fissure.activation}
                  endtime={fissure.expiry}
                  interval={1000}
                  pullright={false}
                  style={{ padding: '5px' }}
                />
              </span>
            </div>
          </HubPanelListItem>
        ))}
        {filteredFissures.length === 0 && <NoDataItem text={headertext} overrideBorder />}
      </HubPanelList>
    </HubPanelWrap>
  );
};
export default FissuresPanel;

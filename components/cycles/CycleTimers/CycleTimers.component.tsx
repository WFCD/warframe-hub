'use client';
import './CycleTimers.component.scss';

import type { FC, ReactNode } from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Tooltip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { cdn, isArbitrationActive, isRealInstant, parseInstant, type WorldstateData } from '@/lib/shared';
import { tCycleState } from '@/lib/i18n';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import { HUB_TOOLTIP_DELAY } from '@/lib/ui/tooltipTiming';
import TimeBadge from '@/components/ui/TimeBadge';
import HubImg from '@/components/media/HubImg';
import AsyncItemThumb from '@/components/media/AsyncItemThumb';

dayjs.extend(utc);

const steelPathLogo = cdn('svg/sp-logo.svg');

/** Cetus / Plains of Eidolon day-night cycle lengths (minutes). */
const CETUS_DAY_MINUTES = 100;
const CETUS_NIGHT_MINUTES = 50;

/** Orb Vallis temperature cycle (minutes; warm phase is 6 min 40 sec). */
const VALLIS_COLD_MINUTES = 20;

/** Cambion Drift Fass / Vome cycle lengths (minutes). */
const CAMBION_FASS_MINUTES = 100;
const CAMBION_VOME_MINUTES = 50;

/** Zariman Corpus / Grineer occupation length (minutes). */
const ZARIMAN_FACTION_MINUTES = 120;

type Cycle = {
  activation?: string;
  expiry?: string;
  isDay?: boolean;
  isWarm?: boolean;
  state?: string;
  active?: string;
};

type CycleTimersProps = {
  worldstate: WorldstateData;
};

type CycleTimerPillProps = {
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
  detail?: ReactNode;
  title?: string;
  hideBadgeSpacer?: boolean;
};

const timerBadge = (start: string, end: string) => (
  <TimeBadge
    starttime={start}
    endtime={end}
    interval={1000}
    pullright={false}
    className='hub-cycle-timer-badge'
  />
);

const CycleTimerPill: FC<CycleTimerPillProps> = ({
  label,
  icon,
  badge,
  detail,
  title,
  hideBadgeSpacer = false,
}: CycleTimerPillProps) => {
  const body = (
    <>
      <span className='hub-cycle-timer-pill-icon' aria-hidden>
        {icon}
      </span>
      <span className='hub-cycle-timer-pill-label'>{label}</span>
      {detail ? <span className='hub-cycle-timer-pill-detail'>{detail}</span> : null}
      {!badge && !hideBadgeSpacer && !detail ? (
        <span className='hub-cycle-timer-badge-spacer' aria-hidden />
      ) : null}
    </>
  );

  const pill = (
    <div className='hub-cycle-timer-pill-wrap'>
      <div className={`hub-cycle-timer-pill${detail ? ' hub-cycle-timer-pill--has-detail' : ''}`}>
        {title && title !== label ? (
          <Tooltip delay={HUB_TOOLTIP_DELAY}>
            <Tooltip.Trigger className='hub-cycle-timer-tooltip-trigger hub-cycle-timer-pill-tooltip-target'>
              {body}
            </Tooltip.Trigger>
            <Tooltip.Content placement='top'>
              <span className='hub-cycle-timer-tooltip-text'>{title}</span>
            </Tooltip.Content>
          </Tooltip>
        ) : (
          <span className='hub-cycle-timer-pill-body'>{body}</span>
        )}
        {badge}
      </div>
    </div>
  );

  return pill;
};

const CycleTimers: FC<CycleTimersProps> = ({ worldstate }: CycleTimersProps) => {
  const { t } = useTranslation();
  const { state } = usePrefs();
  const components = state.components;
  const now = dayjs().toISOString();

  const arbitration = worldstate.arbitration as
    | { expiry?: string; activation: string; node: string; type: string; enemy?: string }
    | undefined;
  const arbitrationActive = isArbitrationActive(arbitration);
  const sentientOutposts = worldstate.sentientOutposts as
    | { active?: boolean; mission?: { node?: string; type?: string } }
    | undefined;
  const isSentientOutpostActive = sentientOutposts?.active ?? false;
  const steelPath = worldstate.steelPath as
    | { activation?: string; expiry?: string; currentReward?: { name?: string; cost?: number } }
    | undefined;

  const items: { id: string; pill: ReactNode; size?: 'narrow' | 'wide-1-25' | 'wide-1-5' | 'wide' }[] = [];

  if (components.cetus?.display) {
    const cetusCycle = worldstate.cetusCycle as Cycle | undefined;
    const isDay = cetusCycle?.isDay ?? false;
    const earthLabel = t('location.earth');
    items.push({
      id: 'cetus',
      pill: (
        <CycleTimerPill
          label={earthLabel}
          title={t('location.earthTooltip', {
            currentState: t(isDay ? 'time.day' : 'time.night'),
            dayMinutes: CETUS_DAY_MINUTES,
            nightMinutes: CETUS_NIGHT_MINUTES,
          })}
          icon={isDay ? <i className='fa fa-sun day' /> : <i className='fa fa-moon night' />}
          badge={timerBadge(cetusCycle?.activation || now, cetusCycle?.expiry || now)}
        />
      ),
    });
  }

  if (components.vallis?.display) {
    const vallisCycle = worldstate.vallisCycle as (Cycle & { isWarm?: boolean }) | undefined;
    const isWarm = vallisCycle?.isWarm;
    const vallisLabel = t('location.vallis');
    items.push({
      id: 'vallis',
      pill: (
        <CycleTimerPill
          label={vallisLabel}
          title={t('location.vallisTooltip', {
            currentState:
              isWarm === undefined ? t('time.loading') : t(isWarm ? 'time.warm' : 'time.cold'),
            coldMinutes: VALLIS_COLD_MINUTES,
          })}
          icon={isWarm ? <i className='fa fa-fire warm' /> : <i className='fa fa-snowflake cold' />}
          badge={timerBadge(vallisCycle?.activation || now, vallisCycle?.expiry || now)}
        />
      ),
    });
  }

  if (components.cambion?.display) {
    const cambionCycle = worldstate.cambionCycle as Cycle | undefined;
    const phase = cambionCycle?.active?.toLowerCase() ?? cambionCycle?.state?.toLowerCase();
    const cambionLabel = t('location.cambion');
    items.push({
      id: 'cambion',
      pill: (
        <CycleTimerPill
          label={cambionLabel}
          title={t('location.cambionTooltip', {
            currentState: tCycleState(t, cambionCycle),
            fassMinutes: CAMBION_FASS_MINUTES,
            vomeMinutes: CAMBION_VOME_MINUTES,
          })}
          icon={
            phase === 'fass' ? (
              <i className='fa fa-sun day' />
            ) : phase === 'vome' ? (
              <i className='fa fa-moon night' />
            ) : (
              <i className='fa fa-circle' />
            )
          }
          badge={timerBadge(cambionCycle?.activation || now, cambionCycle?.expiry ?? now)}
        />
      ),
    });
  }

  if (components.zariman?.display) {
    const zarimanCycle = worldstate.zarimanCycle as Cycle | undefined;
    const stateKey = zarimanCycle?.state?.toLowerCase();
    const zarimanLabel = t('location.zariman');
    items.push({
      id: 'zariman',
      size: 'wide-1-25',
      pill: (
        <CycleTimerPill
          label={zarimanLabel}
          title={t('location.zarimanTooltip', {
            currentState: tCycleState(t, zarimanCycle),
            factionMinutes: ZARIMAN_FACTION_MINUTES,
          })}
          icon={
            stateKey === 'corpus' ? (
              <i className='icon-factions-corpus' />
            ) : stateKey === 'grineer' ? (
              <i className='icon-factions-grineer' />
            ) : (
              <i className='fa fa-circle' />
            )
          }
          badge={timerBadge(zarimanCycle?.activation || now, zarimanCycle?.expiry ?? now)}
        />
      ),
    });
  }

  if (components.reset?.display) {
    const nextDay = dayjs.utc().endOf('day').add(1, 'seconds').toISOString();
    items.push({
      id: 'reset',
      size: 'narrow',
      pill: (
        <CycleTimerPill
          label={t('reset.header')}
          title={t('reset.tooltip')}
          icon={<i className='fas fa-redo-alt' />}
          badge={timerBadge(now, nextDay)}
        />
      ),
    });
  }

  if (components.sentientoutposts?.display && isSentientOutpostActive && sentientOutposts?.mission) {
    const { node, type } = sentientOutposts.mission;
    items.push({
      id: 'sentient',
      size: 'wide-1-5',
      pill: (
        <CycleTimerPill
          label={t('sentientoutpost.header')}
          title={`${t('sentientoutpost.header')} — ${node} (${type})`}
          icon={<i className='icon-factions-sentient' />}
          detail={type ? `${node} (${type})` : node}
          hideBadgeSpacer
        />
      ),
    });
  }

  if (components['steel-path']?.display && steelPath) {
    const reward = steelPath.currentReward;
    items.push({
      id: 'steel-path',
      size: 'wide',
      pill: (
        <CycleTimerPill
          label={t('steelPath.header')}
          title={reward?.name ? `${t('steelPath.header')} — ${reward.name}` : t('steelPath.header')}
          icon={
            <HubImg
              src={steelPathLogo}
              name={t('steelPath.header')}
              className='hub-cycle-timer-pill-img no-invert'
              height='12px'
              width='12px'
            />
          }
          detail={
            reward?.name ? (
              <span className='hub-cycle-timer-pill-reward'>
                {reward.name}
                {reward.cost ? (
                  <>
                    {' '}
                    ({reward.cost}
                    <AsyncItemThumb ikey='Steel Essence' alt={t('currency.steelEssense')} />)
                  </>
                ) : null}
              </span>
            ) : undefined
          }
          badge={
            isRealInstant(parseInstant(steelPath.expiry))
              ? timerBadge(steelPath.activation!, steelPath.expiry!)
              : undefined
          }
        />
      ),
    });
  }

  if (arbitrationActive && components.arbitration?.display && arbitration) {
    const enemy = arbitration.enemy?.toLowerCase() || 'corrupted';
    items.push({
      id: 'arbitration',
      pill: (
        <CycleTimerPill
          label={t('arbitration.header')}
          title={`${t('arbitration.header')} — ${arbitration.node} (${arbitration.type})`}
          icon={<i className={`icon-factions-${enemy}`} />}
          detail={arbitration.node}
          badge={
            isRealInstant(parseInstant(arbitration.expiry))
              ? timerBadge(arbitration.activation!, arbitration.expiry!)
              : undefined
          }
        />
      ),
    });
  }

  if (items.length === 0) return null;

  const cellClass = (size?: 'narrow' | 'wide-1-25' | 'wide-1-5' | 'wide') => {
    switch (size) {
      case 'narrow':
        return 'hub-cycle-timer-cell hub-cycle-timer-cell--narrow';
      case 'wide-1-25':
        return 'hub-cycle-timer-cell hub-cycle-timer-cell--wide-1-25';
      case 'wide-1-5':
        return 'hub-cycle-timer-cell hub-cycle-timer-cell--wide-1-5';
      case 'wide':
        return 'hub-cycle-timer-cell hub-cycle-timer-cell--wide';
      default:
        return 'hub-cycle-timer-cell';
    }
  };

  return (
    <div className='hub-cycle-timers' aria-label={t('time.Timer')}>
      {items.map(({ id, pill, size }) => (
        <div key={id} className={cellClass(size)}>
          <div className='hub-cycle-timer-cell-inner'>{pill}</div>
        </div>
      ))}
    </div>
  );
};

export default CycleTimers;

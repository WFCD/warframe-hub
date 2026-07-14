'use client';

import type { FC } from 'react';
import type { TimerPanelComponent } from './timerPanelImports';
import type { TimerPanelRenderContext } from './renderTimerPanel';

type TimerPanelBodyProps = TimerPanelRenderContext & {
  Panel: TimerPanelComponent;
};

const TimerPanelBody: FC<TimerPanelBodyProps> = ({
  panelKey,
  Panel,
  worldstate,
  ostron,
  solaris,
  entrati,
}: TimerPanelBodyProps) => {
  switch (panelKey) {
    case 'construction':
      return <Panel construction={worldstate.constructionProgress} />;
    case 'darvo':
      return <Panel deals={(worldstate.dailyDeals as unknown[]) ?? []} />;
    case 'news':
      return <Panel news={(worldstate.news as unknown[]) ?? []} />;
    case 'event':
      return <Panel events={(worldstate.events as unknown[]) ?? []} />;
    case 'alerts':
      return <Panel alerts={(worldstate.alerts as unknown[]) ?? []} />;
    case 'invasions':
      return <Panel invasions={(worldstate.invasions as unknown[]) ?? []} />;
    case 'nightwave':
      return (
        <Panel nightwave={(worldstate.nightwave as { activeChallenges?: unknown[] }) ?? { activeChallenges: [] }} />
      );
    case 'conclave':
      return <Panel conclave={(worldstate.conclaveChallenges as unknown[]) ?? []} />;
    case 'sortie':
      return worldstate.sortie ? <Panel sortie={worldstate.sortie} /> : null;
    case 'archonHunt':
      return worldstate.archonHunt ? <Panel sortie={worldstate.archonHunt} /> : null;
    case 'fissures':
      return <Panel fissures={(worldstate.fissures as unknown[]) ?? []} variant="fissures" />;
    case 'voidStorms':
      return <Panel fissures={(worldstate.fissures as unknown[]) ?? []} variant="voidStorms" />;
    case 'steelPathFissures':
      return <Panel fissures={(worldstate.fissures as unknown[]) ?? []} variant="steelPathFissures" />;
    case 'bounties':
      return ostron ? <Panel syndicate={ostron} type="ostron" /> : null;
    case 'solaris-bounties':
      return solaris ? <Panel syndicate={solaris} type="solaris" /> : null;
    case 'entrati-bounties':
      return entrati ? <Panel syndicate={entrati} type="entrati" /> : null;
    case 'deals':
      return <Panel sales={(worldstate.flashSales as unknown[]) ?? []} />;
    case 'baro':
      return <Panel voidTrader={(worldstate.voidTrader as Record<string, unknown>) ?? {}} />;
    default:
      return null;
  }
};

export default TimerPanelBody;

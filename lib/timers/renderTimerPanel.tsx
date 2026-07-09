import type { ReactNode } from 'react';
import type { ComponentsMap, WorldstateData } from '@/lib/shared';
import {
  AlertPanel,
  BountyPanel,
  ConstructionPanel,
  ConclavePanel,
  DarvoDealsPanel,
  EventsPanel,
  FissuresPanel,
  InvasionsPanel,
  NewsPanel,
  NightwavePanel,
  SalesPanel,
  SortiePanel,
  VoidTraderPanel,
} from '@/components/panels';
import type { MasonryPanelKey } from './masonryPanels';

type SyndicateMission = { id: string };

export type TimerPanelRenderContext = {
  key: MasonryPanelKey;
  worldstate: WorldstateData;
  components: ComponentsMap;
  ostron?: SyndicateMission;
  solaris?: SyndicateMission;
  entrati?: SyndicateMission;
};

export const renderTimerPanel = ({
  key,
  worldstate,
  ostron,
  solaris,
  entrati,
}: TimerPanelRenderContext): ReactNode => {
  switch (key) {
    case 'construction':
      return <ConstructionPanel construction={worldstate.constructionProgress} />;
    case 'darvo':
      return <DarvoDealsPanel deals={(worldstate.dailyDeals as unknown[]) ?? []} />;
    case 'news':
      return <NewsPanel news={(worldstate.news as unknown[]) ?? []} />;
    case 'event':
      return <EventsPanel events={(worldstate.events as unknown[]) ?? []} />;
    case 'alerts':
      return <AlertPanel alerts={(worldstate.alerts as unknown[]) ?? []} />;
    case 'invasions':
      return <InvasionsPanel invasions={(worldstate.invasions as unknown[]) ?? []} />;
    case 'nightwave':
      return (
        <NightwavePanel
          nightwave={(worldstate.nightwave as { activeChallenges?: unknown[] }) ?? { activeChallenges: [] }}
        />
      );
    case 'conclave':
      return <ConclavePanel conclave={(worldstate.conclaveChallenges as unknown[]) ?? []} />;
    case 'sortie':
      return worldstate.sortie ? <SortiePanel sortie={worldstate.sortie} /> : null;
    case 'archonHunt':
      return worldstate.archonHunt ? <SortiePanel sortie={worldstate.archonHunt} /> : null;
    case 'fissures':
      return <FissuresPanel fissures={(worldstate.fissures as unknown[]) ?? []} variant="fissures" />;
    case 'voidStorms':
      return <FissuresPanel fissures={(worldstate.fissures as unknown[]) ?? []} variant="voidStorms" />;
    case 'steelPathFissures':
      return <FissuresPanel fissures={(worldstate.fissures as unknown[]) ?? []} variant="steelPathFissures" />;
    case 'bounties':
      return ostron ? <BountyPanel syndicate={ostron} type="ostron" /> : null;
    case 'solaris-bounties':
      return solaris ? <BountyPanel syndicate={solaris} type="solaris" /> : null;
    case 'entrati-bounties':
      return entrati ? <BountyPanel syndicate={entrati} type="entrati" /> : null;
    case 'deals':
      return <SalesPanel sales={(worldstate.flashSales as unknown[]) ?? []} />;
    case 'baro':
      return <VoidTraderPanel voidTrader={(worldstate.voidTrader as Record<string, unknown>) ?? {}} />;
    default:
      return null;
  }
};

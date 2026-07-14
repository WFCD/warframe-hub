import type { WorldstateData } from '@/lib/shared';

const arbitrationId = (arbitration: { expiry?: string }): string | undefined => {
  if (!arbitration.expiry) return undefined;
  return `arbitration:${new Date(arbitration.expiry).getTime()}`;
};

export const collectNotifiedIds = (ws: WorldstateData): string[] =>
  [
    ...((ws.alerts as Array<{ id: string }> | undefined)?.map((alert) => alert.id) ?? []),
    ...((ws.invasions as Array<{ id: string }> | undefined)?.map((invasion) => invasion.id) ?? []),
    ...((ws.news as Array<{ id: string }> | undefined)?.map((item) => item.id) ?? []),
    ...((ws.events as Array<{ id: string }> | undefined)?.map((event) => event.id) ?? []),
    ...(ws.sortie ? [(ws.sortie as { id: string }).id] : []),
    ...((ws.syndicateMissions as Array<{ id: string }> | undefined)?.map((item) => item.id) ?? []),
    ...((ws.fissures as Array<{ id: string }> | undefined)?.map((item) => item.id) ?? []),
    ...((ws.dailyDeals as Array<{ id: string }> | undefined)?.map((deal) => deal.id) ?? []),
    ...((ws.flashSales as Array<{ id: string }> | undefined)?.map((item) => item.id) ?? []),
    ...((ws.conclaveChallenges as Array<{ id: string }> | undefined)?.map((item) => item.id) ?? []),
    ...(ws.cetusCycle ? [(ws.cetusCycle as { id: string }).id] : []),
    ...(ws.zarimanCycle ? [(ws.zarimanCycle as { id: string }).id] : []),
    ...(ws.voidTrader ? [(ws.voidTrader as { id: string }).id] : []),
    ...(ws.arbitration ? [arbitrationId(ws.arbitration as { expiry?: string })].filter(Boolean) : []),
    ...(ws.nightwave
      ? ((ws.nightwave.activeChallenges as Array<{ id: string }> | undefined) ?? []).map(
          (challenge) => challenge.id,
        )
      : []),
    ...(ws.sentientOutposts ? [(ws.sentientOutposts as { id: string }).id] : []),
    ...(ws.archonHunt ? [(ws.archonHunt as { id: string }).id] : []),
    ...(ws.vallisCycle ? [(ws.vallisCycle as { id: string }).id] : []),
  ].filter(Boolean) as string[];

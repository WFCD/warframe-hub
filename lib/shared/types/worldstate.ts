import type { Platform } from './platform';

export type WorldstateData = Record<string, unknown> & {
  timestamp?: string;
  news?: unknown[];
  events?: unknown[];
  alerts?: unknown[];
  invasions?: unknown[];
  nightwave?: { activeChallenges?: unknown[] };
  conclaveChallenges?: unknown[];
  sortie?: unknown;
  archonHunt?: unknown;
  fissures?: unknown[];
  syndicateMissions?: unknown[];
  flashSales?: unknown[];
  dailyDeals?: unknown[];
  voidTrader?: unknown;
  constructionProgress?: unknown;
  cetusCycle?: unknown;
  zarimanCycle?: unknown;
  arbitration?: unknown;
  sentientOutposts?: unknown;
};

export type WorldstatesByPlatform = Record<Platform, WorldstateData>;

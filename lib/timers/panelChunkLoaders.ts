import type { MasonryPanelKey } from './masonryPanels';
import type { TimerPanelComponent } from './timerPanelTypes';

type PanelChunkLoader = () => Promise<TimerPanelComponent>;

/** One dynamic import per panel — Vite emits separate async chunks. */
export const panelChunkLoaders: Record<MasonryPanelKey, PanelChunkLoader> = {
  alerts: async () => (await import('@/components/panels/worldstate/AlertPanel')).default as TimerPanelComponent,
  archonHunt: async () => (await import('@/components/panels/worldstate/SortiePanel')).default as TimerPanelComponent,
  baro: async () => (await import('@/components/panels/worldstate/VoidTraderPanel')).default as TimerPanelComponent,
  bounties: async () => (await import('@/components/panels/worldstate/BountyPanel')).default as TimerPanelComponent,
  construction: async () =>
    (await import('@/components/panels/worldstate/ConstructionPanel')).default as TimerPanelComponent,
  conclave: async () => (await import('@/components/panels/worldstate/ConclavePanel')).default as TimerPanelComponent,
  darvo: async () => (await import('@/components/panels/worldstate/DarvoDealsPanel')).default as TimerPanelComponent,
  deals: async () => (await import('@/components/panels/worldstate/SalesPanel')).default as TimerPanelComponent,
  'entrati-bounties': async () =>
    (await import('@/components/panels/worldstate/BountyPanel')).default as TimerPanelComponent,
  event: async () => (await import('@/components/panels/worldstate/EventsPanel')).default as TimerPanelComponent,
  fissures: async () => (await import('@/components/panels/worldstate/FissuresPanel')).default as TimerPanelComponent,
  invasions: async () => (await import('@/components/panels/worldstate/InvasionsPanel')).default as TimerPanelComponent,
  news: async () => (await import('@/components/panels/worldstate/NewsPanel')).default as TimerPanelComponent,
  nightwave: async () => (await import('@/components/panels/worldstate/NightwavePanel')).default as TimerPanelComponent,
  'solaris-bounties': async () =>
    (await import('@/components/panels/worldstate/BountyPanel')).default as TimerPanelComponent,
  sortie: async () => (await import('@/components/panels/worldstate/SortiePanel')).default as TimerPanelComponent,
  steelPathFissures: async () =>
    (await import('@/components/panels/worldstate/FissuresPanel')).default as TimerPanelComponent,
  voidStorms: async () => (await import('@/components/panels/worldstate/FissuresPanel')).default as TimerPanelComponent,
};

import type { Platform } from './platform';

export type ComponentConfig = {
  display: boolean;
  displayable?: boolean;
  displayName?: string;
  key: string;
  component?: string;
  props?: Record<string, string>;
  autoCycle?: boolean;
};

export type ComponentsMap = Record<string, ComponentConfig>;

export type TrackableEntry = { state: boolean; [key: string]: unknown };
export type TrackablesMap = {
  rewardTypes: Record<string, TrackableEntry>;
  eventTypes: Record<string, TrackableEntry>;
};

export type FissurePlanetEntry = { state: boolean; [key: string]: unknown };

export type PrefsState = {
  platform: Platform;
  theme: string;
  locale: string;
  components: ComponentsMap;
  /** Masonry panel keys on the timers page, top-to-bottom / left-to-right flow order. */
  componentOrder: string[];
  trackables: TrackablesMap;
  fissurePlanets: Record<string, FissurePlanetEntry>;
  fissureDisplays: string;
  soundFilters: string[];
};

export type MapsState = {
  poeMapToggles: Record<string, boolean>;
  vallisMapToggles: Record<string, boolean>;
  deimosMapToggles: Record<string, boolean>;
  bountyToggles: Record<string, boolean>;
};

export type NotificationsState = {
  notificationsAllowed: NotificationPermission | 'default';
  notifiedIds: Record<Platform, string[]>;
};

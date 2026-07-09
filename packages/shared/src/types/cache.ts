import type { Platform } from './platform';

export type CacheState = {
  rivens: Record<Platform, unknown[]>;
  synthData: unknown[];
  warframes: unknown[];
  weapons: unknown[];
  mods: unknown[];
};

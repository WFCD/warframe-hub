import type { Platform } from './platform';
import type { CodexItem } from './codex';

export type CacheState = {
  rivens: Record<Platform, unknown[]>;
  synthData: unknown[];
  items: CodexItem[];
};

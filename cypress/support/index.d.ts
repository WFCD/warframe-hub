/// <reference types="cypress" />

interface HubCacheSeed {
  synth?: unknown;
  rivens?: unknown;
}

interface VisitHubOptions {
  cache?: HubCacheSeed;
  onBeforeLoad?: (win: AUTWindow) => void;
  live?: boolean;
  failOnStatusCode?: boolean;
}

interface SeedHubOptions {
  fixture?: string;
  platform?: string;
  /** Component keys to force `display: true` in hub.v1.prefs before load. */
  enablePanels?: string[];
}

declare global {
  namespace Cypress {
    interface Chainable {
      setupIntercepts(): Chainable<void>;
      resetHubStorage(): Chainable<void>;
      seedCache(seed?: HubCacheSeed): Chainable<void>;
      seedHub(options?: SeedHubOptions): Chainable<void>;
      visitHub(path?: string, options?: VisitHubOptions): Chainable<void>;
      mountPanel(componentModule: unknown, options?: { props?: Record<string, unknown> }): Chainable<void>;
    }
  }
}

export {};

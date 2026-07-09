import type { WorldstateData } from '../../lib/shared';
import fullWorldstate from '../../lib/fixtures/worldstate/full.json';
import timersFullOverrides from '../../lib/fixtures/worldstate/timers-full.json';
import componentsJson from '../../data/json/components.json';

const HUB_STORAGE_PREFIXES = ['hub.v1.', 'vuex', 'cache'] as const;

type PlatformKey = keyof typeof fullWorldstate;
type ComponentsMap = Record<string, { display?: boolean; [key: string]: unknown }>;

const withHubTest = (path: string): string => {
  if (path.includes('hubTest=')) return path;
  return path.includes('?') ? `${path}&hubTest=1` : `${path}?hubTest=1`;
};

const worldstateForFixture = (fixture: string, platform: PlatformKey): WorldstateData => {
  const base = (fullWorldstate[platform] ?? fullWorldstate.pc) as WorldstateData;
  if (fixture === 'timers-full') {
    return { ...base, ...timersFullOverrides } as WorldstateData;
  }
  return base;
};

const prefsWithEnabledPanels = (enablePanels: string[] = []): string => {
  const components = structuredClone(componentsJson) as ComponentsMap;
  for (const key of enablePanels) {
    if (components[key]) {
      components[key] = { ...components[key], display: true };
    }
  }
  return JSON.stringify({ components });
};

Cypress.Commands.add('setupIntercepts', () => {
  cy.intercept('https://sentry.io/*', { log: false });
});

Cypress.Commands.add('resetHubStorage', () => {
  cy.window().then((win) => {
    Object.keys(win.localStorage)
      .filter((key) => HUB_STORAGE_PREFIXES.some((prefix) => key === prefix || key.startsWith(prefix)))
      .forEach((key) => win.localStorage.removeItem(key));
  });
});

Cypress.Commands.add('seedCache', ({ synth, rivens }: HubCacheSeed = {}) => {
  cy.window().then((win) => {
    if (synth) {
      win.localStorage.setItem('hub.v1.cache.synth', JSON.stringify(synth));
    }
    if (rivens) {
      win.localStorage.setItem('hub.v1.cache.rivens', JSON.stringify(rivens));
    }
  });
});

Cypress.Commands.add(
  'seedHub',
  ({ fixture = 'worldstate/full', platform = 'pc', enablePanels = [] }: SeedHubOptions = {}) => {
    const platformKey = (platform in fullWorldstate ? platform : 'pc') as PlatformKey;
    const worldstate = worldstateForFixture(fixture, platformKey);

    cy.intercept('GET', `https://api.warframestat.us/${platform}/?language=*`, (req) => {
      req.reply({ statusCode: 200, body: worldstate });
    }).as('worldstate');

    cy.intercept('GET', `https://api.warframestat.us/${platform}/*`, (req) => {
      req.reply({ statusCode: 200, body: worldstate });
    }).as('worldstateAlt');

    cy.visit(withHubTest(`/?fixture=${fixture}`), {
      onBeforeLoad(win) {
        Object.keys(win.localStorage)
          .filter((key) => HUB_STORAGE_PREFIXES.some((prefix) => key === prefix || key.startsWith(prefix)))
          .forEach((key) => win.localStorage.removeItem(key));
        win.localStorage.setItem(`hub.v1.ws.${platform}`, JSON.stringify(worldstate));
        if (enablePanels.length > 0) {
          win.localStorage.setItem('hub.v1.prefs', prefsWithEnabledPanels(enablePanels));
        }
      },
    });
  }
);

Cypress.Commands.add(
  'visitHub',
  (path = '/', { cache, onBeforeLoad, live = false, failOnStatusCode = true }: VisitHubOptions = {}) => {
    cy.setupIntercepts();
    const target = live ? path : withHubTest(path);
    cy.visit(target, {
      failOnStatusCode,
      onBeforeLoad(win) {
        Object.keys(win.localStorage)
          .filter((key) => HUB_STORAGE_PREFIXES.some((prefix) => key === prefix || key.startsWith(prefix)))
          .forEach((key) => win.localStorage.removeItem(key));
        if (cache?.synth) {
          win.localStorage.setItem('hub.v1.cache.synth', JSON.stringify(cache.synth));
        }
        if (cache?.rivens) {
          win.localStorage.setItem('hub.v1.cache.rivens', JSON.stringify(cache.rivens));
        }
        onBeforeLoad?.(win);
      },
    });
  }
);

Cypress.Commands.add(
  'mountPanel',
  (componentModule: unknown, { props = {} }: { props?: Record<string, unknown> } = {}) => {
    cy.wrap({ componentModule, props });
  }
);

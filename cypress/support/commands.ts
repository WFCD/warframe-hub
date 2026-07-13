import type { WorldstateData } from '../../lib/shared';
import { dismissVinextDevOverlay } from '../../lib/test/dismissVinextDevOverlay';
import fullWorldstate from '../../lib/fixtures/worldstate/full.json';
import timersFullOverrides from '../../lib/fixtures/worldstate/timers-full.json';
import componentsJson from '../../data/json/components.json';
import { MASONRY_PANEL_KEYS } from '../../lib/timers/masonryPanels';

const HUB_STORAGE_PREFIXES = ['hub.v1.', 'vuex', 'cache'] as const;
const CODEX_DB_NAME = 'hub-v1';
const CODEX_STORE = 'codex-items';
const CODEX_DB_VERSION = 2;
const CODEX_DETAIL_STORE = 'codex-item-details';

const openCodexDb = (win: Window): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = win.indexedDB.open(CODEX_DB_NAME, CODEX_DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CODEX_STORE)) {
        db.createObjectStore(CODEX_STORE, { keyPath: 'locale' });
      }
      if (!db.objectStoreNames.contains(CODEX_DETAIL_STORE)) {
        db.createObjectStore(CODEX_DETAIL_STORE, { keyPath: 'id' });
      }
    };
  });

const clearCodexItemsDb = (win: Window): Promise<void> =>
  openCodexDb(win).then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(CODEX_STORE, 'readwrite');
        const request = tx.objectStore(CODEX_STORE).clear();
        request.onerror = () => reject(request.error ?? new Error('IndexedDB clear failed'));
        tx.oncomplete = () => resolve();
      }),
  );

const readCodexItemsCount = (win: Window, locale = 'en'): Promise<number> =>
  openCodexDb(win).then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(CODEX_STORE, 'readonly');
        const request = tx.objectStore(CODEX_STORE).get(locale);
        request.onsuccess = () => {
          const record = request.result as { items?: unknown[] } | undefined;
          resolve(record?.items?.length ?? 0);
        };
        request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
      }),
  );

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

const prefsWithEnabledPanels = (enablePanels: string[] = [], enableAllMasonryPanels = false): string => {
  const components = structuredClone(componentsJson) as ComponentsMap;
  if (enableAllMasonryPanels) {
    for (const key of MASONRY_PANEL_KEYS) {
      if (components[key]) {
        components[key] = { ...components[key], display: true };
      }
    }
  }
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
    return clearCodexItemsDb(win);
  });
});

Cypress.Commands.add('seedCache', ({ synth, rivens, items }: HubCacheSeed = {}) => {
  cy.window().then((win) => {
    if (synth) {
      win.localStorage.setItem('hub.v1.cache.synth', JSON.stringify(synth));
    }
    if (rivens) {
      win.localStorage.setItem('hub.v1.cache.rivens', JSON.stringify(rivens));
    }
    if (items) {
      win.localStorage.setItem('hub.v1.cache.codex.items', JSON.stringify(items));
    }
  });
});

Cypress.Commands.add(
  'seedHub',
  ({
    fixture = 'worldstate/full',
    platform = 'pc',
    enablePanels = [],
    enableAllMasonryPanels = false,
  }: SeedHubOptions = {}) => {
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
        if (enablePanels.length > 0 || enableAllMasonryPanels) {
          win.localStorage.setItem(
            'hub.v1.prefs',
            prefsWithEnabledPanels(enablePanels, enableAllMasonryPanels),
          );
        }
      },
    });
    cy.window().then((win) => dismissVinextDevOverlay(win.document));
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
        if (cache?.items) {
          win.localStorage.setItem('hub.v1.cache.codex.items', JSON.stringify(cache.items));
        }
        onBeforeLoad?.(win);
      },
    });
    cy.window().then((win) => dismissVinextDevOverlay(win.document));
    cy.get('#app', { timeout: 15000 }).should('be.visible');
  }
);

Cypress.Commands.add('readCodexItemsCount', (locale = 'en') => {
  cy.window().then((win) => readCodexItemsCount(win, locale));
});

Cypress.Commands.add(
  'mountPanel',
  (componentModule: unknown, { props = {} }: { props?: Record<string, unknown> } = {}) => {
    cy.wrap({ componentModule, props });
  }
);

Cypress.Commands.add('waitForHubTable', (minRows = 1) => {
  cy.get('.hub-content-loading', { timeout: 15000 }).should('not.exist');
  cy.get('.hub-native-table tbody tr', { timeout: 15000 }).should('have.length.at.least', minRows);
});

Cypress.Commands.add('hubClick', { prevSubject: 'element' }, (subject) => {
  cy.window().then((win) => dismissVinextDevOverlay(win.document));
  // Mobile viewport makes Cypress emit touch; realClick dispatches mouse/pointer React Aria expects.
  cy.wrap(subject).scrollIntoView().should('be.visible').realClick({ pointerType: 'mouse' });
  return cy.wrap(subject);
});

Cypress.Commands.add('hubActivate', { prevSubject: 'element' }, (subject) => {
  cy.window().then((win) => dismissVinextDevOverlay(win.document));
  cy.wrap(subject).scrollIntoView().should('be.visible').focus().realPress('Enter');
  return cy.wrap(subject);
});

Cypress.Commands.add('hubOpenSettings', () => {
  cy.window().its('__hubTestBridge').should('exist').invoke('openSettings');
});

Cypress.Commands.add('hubOpenMenu', (key: string) => {
  cy.window().its('__hubTestBridge').should('exist').invoke('openMenu', key);
});

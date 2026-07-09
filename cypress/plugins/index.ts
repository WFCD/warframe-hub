import type { PluginEvents, PluginConfigOptions } from 'cypress/types/cypress';

const setupNodeEvents = (_on: PluginEvents, _config: PluginConfigOptions) => {
  // E2E runs against vinext dev server; component CT uses Vite via cypress.config.ts
};

export default setupNodeEvents;

import { defineConfig } from 'cypress';
import cypressPlugins from './cypress/plugins/index.js';

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return cypressPlugins(on, config);
    },
    specPattern: 'cypress/e2e/**/*.spec.js',
  },
  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'components/**/*.spec.js',
  },
  retries: {
    runMode: 3,
    openMode: 0,
  },
});

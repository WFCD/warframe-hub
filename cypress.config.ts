import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'cypress';
import setupNodeEvents from './cypress/plugins/index';
import devConfig from './dev.config';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const { port: devPort } = devConfig;

export default defineConfig({
  allowCypressEnv: false,
  fixturesFolder: path.join(repoRoot, 'cypress/fixtures'),
  screenshotsFolder: path.join(repoRoot, 'cypress/screenshots'),
  videosFolder: path.join(repoRoot, 'cypress/videos'),
  e2e: {
    baseUrl: `http://localhost:${devPort}`,
    supportFile: path.join(repoRoot, 'cypress/support/e2e.ts'),
    setupNodeEvents,
    specPattern: path.join(repoRoot, 'cypress/e2e/**/*.spec.ts'),
  },
  component: {
    supportFile: path.join(repoRoot, 'cypress/support/component.ts'),
    indexHtmlFile: path.join(repoRoot, 'cypress/support/component-index.html'),
    specPattern: path.join(repoRoot, 'components/**/*.cy.tsx'),
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        configFile: path.join(repoRoot, 'cypress.vite.config.ts'),
      },
    },
  },
  retries: {
    runMode: 3,
    openMode: 0,
  },
});

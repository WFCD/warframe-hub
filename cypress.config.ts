import path from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig } from 'cypress';
import setupNodeEvents from './cypress/plugins/index';

const require = createRequire(__filename);
const repoRoot = __dirname;
const { port: devPort } = require('./apps/next/dev.config.cjs') as { port: number };

export default defineConfig({
  fixturesFolder: path.join(repoRoot, 'cypress/fixtures'),
  screenshotsFolder: path.join(repoRoot, 'apps/next/cypress/screenshots'),
  videosFolder: path.join(repoRoot, 'apps/next/cypress/videos'),
  e2e: {
    baseUrl: `http://localhost:${devPort}`,
    supportFile: path.join(repoRoot, 'cypress/support/e2e.ts'),
    setupNodeEvents,
    specPattern: path.join(repoRoot, 'cypress/e2e/**/*.spec.ts'),
  },
  component: {
    supportFile: path.join(repoRoot, 'cypress/support/component.ts'),
    indexHtmlFile: path.join(repoRoot, 'cypress/support/component-index.html'),
    specPattern: path.join(repoRoot, 'apps/next/components/**/*.cy.tsx'),
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        configFile: path.join(repoRoot, 'apps/next/cypress.vite.config.ts'),
      },
    },
  },
  retries: {
    runMode: 3,
    openMode: 0,
  },
});

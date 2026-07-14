import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import {
  REACT_ARIA_NO_EXTERNAL,
  REACT_ARIA_OPTIMIZE_DEPS,
  reactAriaIntlSlim,
} from './lib/vite/reactAriaIntlSlim';

/** Vite config for Cypress component tests — no vinext/PWA SSR. */
const appRoot = fileURLToPath(new URL('.', import.meta.url));
const reactAriaRoot = fileURLToPath(new URL('./node_modules/react-aria', import.meta.url));
const reactAriaComponentsRoot = fileURLToPath(
  new URL('./node_modules/react-aria-components', import.meta.url)
);

export default defineConfig({
  plugins: [reactAriaIntlSlim(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': appRoot,
      'cypress/react': fileURLToPath(
        new URL('./node_modules/cypress/react/dist/cypress-react.esm-bundler.js', import.meta.url)
      ),
      'react-aria': reactAriaRoot,
      'react-aria-components': reactAriaComponentsRoot,
    },
    dedupe: ['react', 'react-dom', 'react-aria', 'react-aria-components'],
  },
  optimizeDeps: {
    include: [...REACT_ARIA_OPTIMIZE_DEPS],
  },
  ssr: {
    noExternal: [...REACT_ARIA_NO_EXTERNAL],
    optimizeDeps: {
      include: [...REACT_ARIA_OPTIMIZE_DEPS],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});

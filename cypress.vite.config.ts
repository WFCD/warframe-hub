import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

/** Vite config for Cypress component tests — no vinext/PWA SSR. */
const appRoot = fileURLToPath(new URL('.', import.meta.url));
const reactAriaRoot = fileURLToPath(new URL('./node_modules/react-aria', import.meta.url));
const reactAriaComponentsRoot = fileURLToPath(
  new URL('./node_modules/react-aria-components', import.meta.url)
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});

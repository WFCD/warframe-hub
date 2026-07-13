import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import type { Plugin } from 'vite';
import vinext from 'vinext';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import { runtimeCaching } from './lib/pwa/cacheConfig';
import devConfig from './dev.config.cjs';
import {
  REACT_ARIA_NO_EXTERNAL,
  REACT_ARIA_OPTIMIZE_DEPS,
  reactAriaIntlSlim,
} from './lib/vite/reactAriaIntlSlim';
import { hubChunkGroups } from './lib/vite/hubChunkGroups';

const require = createRequire(import.meta.url);
const appRoot = fileURLToPath(new URL('.', import.meta.url));
const reactAriaRoot = fileURLToPath(new URL('./node_modules/react-aria', import.meta.url));
const reactAriaComponentsRoot = fileURLToPath(
  new URL('./node_modules/react-aria-components', import.meta.url),
);

const cjsInteropPlugin = (pkg: string): Plugin => {
  const prefix = `${pkg}/`;
  const virtualPrefix = `\0${pkg.replace('@', '').replace('/', '-')}-cjs:`;

  return {
    name: `${pkg.replace('/', '-')}-cjs-interop`,
    enforce: 'pre',
    resolveId(source, _importer, options) {
      // Browser dev loads ESM; CJS interop is only for vinext SSR/prerender.
      if (!options?.ssr) return;
      if (source === pkg) return virtualPrefix + source;
      if (!source.startsWith(prefix)) return;
      return virtualPrefix + source;
    },
    load(id) {
      if (!id.startsWith(virtualPrefix)) return;
      const source = id.slice(virtualPrefix.length);
      const sub =
        source === pkg
          ? 'index'
          : source
              .slice(prefix.length)
              .replace(/^cjs\//, '')
              .replace(/\.js$/, '');
      const cjsPath = `${appRoot}node_modules/${pkg}/cjs/${sub}.js`;
      if (!existsSync(cjsPath)) return;
      const mod = require(cjsPath);
      const named = Object.keys(mod).filter((key) => key !== 'default' && /^[A-Za-z_$][\w$]*$/.test(key));
      const namedExports = named.map((key) => `export const ${key} = mod[${JSON.stringify(key)}];`).join('\n');
      return `
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const mod = require(${JSON.stringify(cjsPath)});
export default mod.default ?? mod;
${namedExports}
`;
    },
  };
};

export default defineConfig(() => ({
  plugins: [
    reactAriaIntlSlim(),
    cjsInteropPlugin('@restart/hooks'),
    cjsInteropPlugin('@restart/ui'),
    vinext({
      prerender: { routes: '*' },
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: false,
      },
      includeAssets: ['favicon.ico', 'icon.png'],
      manifest: {
        name: 'Warframe Hub',
        short_name: 'WF Hub',
        description: 'The Home for Warframe Information',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#1a5072',
        background_color: '#222222',
        lang: 'en',
        categories: ['games', 'utilities'],
        icons: [
          { src: '/icon.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globDirectory: fileURLToPath(new URL('./dist/client', import.meta.url)),
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,woff,woff2}'],
        runtimeCaching,
      },
    }),
    hubChunkGroups(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
      // HeroUI bundles react-aria@3.49 while the app resolves 3.50 — duplicate
      // FocusableProvider contexts break Tooltip hover (no onPointerEnter on trigger).
      'react-aria': reactAriaRoot,
      'react-aria-components': reactAriaComponentsRoot,
    },
    dedupe: ['react', 'react-dom', 'react-aria', 'react-aria-components'],
    conditions: ['node', 'import', 'module', 'browser', 'default'],
  },
  optimizeDeps: {
    include: [...REACT_ARIA_OPTIMIZE_DEPS],
  },
  ssr: {
    noExternal: [...REACT_ARIA_NO_EXTERNAL],
    optimizeDeps: {
      include: [...REACT_ARIA_OPTIMIZE_DEPS],
    },
    resolve: {
      conditions: ['node', 'require', 'import'],
    },
  },
  server: {
    port: devConfig.port,
    strictPort: true,
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  preview: {
    port: devConfig.port,
    strictPort: true,
  },
}));

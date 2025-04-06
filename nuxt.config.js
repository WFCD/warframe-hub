import { defineNuxtConfig } from 'nuxt/config';
import locales from './static/json/locales.json';

// i18n
const messages = {};
Object.keys(locales).forEach(async (locale) => {
  messages[locale] = await import(`./static/lang/${locale}.json`);
});

export default defineNuxtConfig({
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Warframe Hub',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'The Home for Warframe Information' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:description', hid: 'og:description', content: 'The Home for Warframe Information' },
      { property: 'og:title', hid: 'og:title', content: 'Warframe Hub' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@fortawesome/fontawesome-free/css/fontawesome.min.css',
    '@fortawesome/fontawesome-free/css/regular.min.css',
    '@fortawesome/fontawesome-free/css/solid.min.css',
    '@fortawesome/fontawesome-free/css/brands.min.css',
    '@/static/less/Warframe-symbols.less',
    '@/static/less/common.less',
    '@/static/less/tables.less',
    '@/static/less/night.less',
    '@/static/less/retro.less',
    '@/static/less/eidolon.less',
    '@/static/less/compact.less',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/binpacker.js',
    '~/plugins/notifications.js',
    '~/plugins/analytics.js',
    '~/plugins/maps.js',
    '~/plugins/kickoffs.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@vite-pwa/nuxt',
    // 'bootstrap-vue/nuxt', // TODO: This is not compatible with Nuxt 3 and there is no replacement.
    '@sentry/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',

    // Moved from `buildModules` in Nuxt 3 migration: https://nuxt.com/docs/migration/configuration#modules
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/device',
  ],

  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },

  i18n: {
    locales: Object.keys(locales),
    defaultLocale: 'en',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'WarframeHub',
      short_name: 'WarframeHub',
      description: 'The Home for Warframe Information',
      theme_color: '#1a5072',
      icons: [
        {
          src: './static/icon.png', // TODO: Replace with image that has correct dimensions
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './static/icon.png', // TODO: Replace with image that has correct dimensions
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },

  ssr: false,

  vue: {
    config: {
      devtools: process.env.NODE_ENV === 'development' ? 'source-map' : false,
    },
  },

  dir: {
    public: 'static',
  },

  loading: {
    color: '#194c6c',
    failedColor: '#852d23',
    background: '#222',
  },

  babel: {
    presets(env, [preset, options]) {
      return [['@nuxt/babel-preset-app', options]];
    },
  },

  compatibilityDate: '2025-04-04',
});

import locales from './static/json/locales.json';

/* Sentry Reporting */
const ignored = /(failed to fetch|EOF|host name|NotAllowedError)/gi;

// i18n
const messages = {};
Object.keys(locales).forEach((locale) => {
  messages[locale] = require(`./static/lang/${locale}.json`);
});

export default {
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

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/device',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'bootstrap-vue/nuxt',
    '@nuxtjs/sentry',
    [
      '@nuxtjs/i18n',
      {
        locales,
        defaultLocale: 'en',
        vueI18n: {
          fallbackLocale: 'en',
          messages,
        },
      },
    ],
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: 'WarframeHub',
      theme: '#1a5072',
    },
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
    },
    icon: {
      source: './static/icon.png',
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  ssr: false,
  vue: {
    config: {
      devtools: process.env.NODE_ENV === 'development',
    },
  },

  sentry: {
    dsn: process.env.VUE_APP_DSN,
    config: {
      beforeSend: (event, hint) => {
        const error = hint.originalException;
        if ((error && error.message && !ignored.test(error.message)) || !error) {
          return event;
        }
      },
    },
  },

  loading: {
    color: '#194c6c',
    failedColor: '#852d23',
    background: '#222',
  },
};

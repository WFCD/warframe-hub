import VueMatomo from 'vue-matomo';
import { defineNuxtPlugin } from '#app';

/* Analytics */
export default defineNuxtPlugin(({ nuxtApp }) => {
  if (process.env.VUE_APP_ANALYICS_URL) {
    nuxtApp.vueApp.use(VueMatomo, {
      host: process.env.VUE_APP_ANALYICS_URL,
      siteId: process.env.VUE_APP_ANALYICS_SITE,
      router: nuxtApp.vueApp.router,
      enableLinkTracking: true,
      disableCookies: true,
      enableHeartBeatTimer: true,
      debug: process.env.NODE_ENV !== 'production',
      domains: 'hub.warframestat.us',
    });
  }
});

import Vue from 'vue';

/* Analytics */
import VueMatomo from 'vue-matomo';
export default ({ app }) => {
  if (process.env.VUE_APP_ANALYICS_URL) {
    Vue.use(VueMatomo, {
      host: process.env.VUE_APP_ANALYICS_URL,
      siteId: process.env.VUE_APP_ANALYICS_SITE,
      router: app.router,
      enableLinkTracking: true,
      disableCookies: true,
      enableHeartBeatTimer: true,
      debug: process.env.NODE_ENV !== 'production',
      domains: 'hub.warframestat.us',
    });
  }
};

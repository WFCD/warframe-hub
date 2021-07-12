'use strict';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';

Vue.config.productionTip = false;

/* Sentry Reporting */
if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_DSN) {
  Sentry.init({
    Vue: Vue,
    dsn: process.env.VUE_APP_DSN,
    integrations: [new Integrations.BrowserTracing()],
  });
}

import VueMobileDetection from 'vue-mobile-detection';
Vue.use(VueMobileDetection);

/* Bootstrap  */
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

/* Load bootstrap css */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

/* FontAwesome */
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';

/* Vue Binpacker (Packery Replacement) */
import VueBinpackerPlugin from 'vue-binpacker-plugin';
Vue.use(VueBinpackerPlugin);

/* Native notifications */
import VueNativeNotification from 'vue-native-notification';
Vue.use(VueNativeNotification, { requestOnNotify: true });

import Notifications from 'vue-notification';
Vue.use(Notifications);

/* Analytics */
import VueMatomo from 'vue-matomo';
if (process.env.VUE_APP_ANALYICS_URL) {
  Vue.use(VueMatomo, {
    host: process.env.VUE_APP_ANALYICS_URL,
    siteId: process.env.VUE_APP_ANALYICS_SITE,
    router: router,
    enableLinkTracking: true,
    disableCookies: true,
    enableHeartBeatTimer: true,
    debug: process.env.NODE_ENV !== 'production',
    domains: 'hub.warframestat.us',
  });
}

/* Leaflet */
import Vue2Leaflet, { L } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

// this part resolve an issue where the markers would not appear
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.use(L);
Vue.component('l-map', Vue2Leaflet.LMap);
Vue.component('l-image-overlay', Vue2Leaflet.LImageOverlay);
Vue.component('l-marker', Vue2Leaflet.LMarker);
Vue.component('l-popup', Vue2Leaflet.LPopup);
Vue.component('l-polyline', Vue2Leaflet.LPolyline);
Vue.component('l-geo-json', Vue2Leaflet.LGeoJson);
Vue.component('l-tooltip', Vue2Leaflet.LTooltip);
Vue.component('l-icon', Vue2Leaflet.LIcon);
Vue.component('l-control-layers', Vue2Leaflet.LControlLayers);
Vue.component('l-layer-group', Vue2Leaflet.LLayerGroup);
Vue.component('l-circle-marker', Vue2Leaflet.LCircleMarker);

/* Themes */
import '@/assets/less/common.less';
import '@/assets/less/tables.less';
import '@/assets/less/night.less';
import '@/assets/less/retro.less';
import '@/assets/less/eidolon.less';
import '@/assets/less/compact.less';

/* Set up i18n */
import VueI18n from 'vue-i18n';
import locales from '@/assets/json/locales.json';

Vue.use(VueI18n);

const messages = {};
Object.keys(locales).forEach((locale) => {
  messages[locale] = require(`@/lang/${locale}.json`);
});

const i18n = new VueI18n({
  locale: store.getters.locale,
  fallbackLocale: 'en',
  messages,
});

// Kick off worldstate refresh
store.dispatch('updateWorldstate');

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

const interval = process.env.VUE_APP_INTERVAL === undefined ? 30000 : Number(process.env.VUE_APP_INTERVAL);
setInterval(() => {
  store.dispatch('updateWorldstate');
}, interval);

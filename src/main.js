'use strict';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

/* Sentry Reporting */

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

if (process.env.VUE_APP_DSN) {
  Sentry.init({
    dsn: process.env.VUE_APP_DSN,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  });
}

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

/* Packery */
import VuePackeryPlugin from 'vue-packery-plugin';
Vue.use(VuePackeryPlugin);

/* Native notifications */
import VueNativeNotification from 'vue-native-notification';
Vue.use(VueNativeNotification, { requestOnNotify: true });

import Notifications from 'vue-notification';
Vue.use(Notifications);

/* Analytics */
import VueAnalytics from 'vue-analytics';
Vue.use(VueAnalytics, { id: 'UA-47080716-6' });

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

// Kick off worldstate refresh
store.dispatch('updateWorldstate');

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

const interval = process.env.VUE_APP_INTERVAL === undefined ? 30000 : Number(process.env.VUE_APP_INTERVAL);
setInterval(() => {
  store.dispatch('updateWorldstate');
}, interval);

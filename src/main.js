import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

/* Bootstrap  */
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

/* Bootswatch */
import 'bootswatch/dist/darkly/bootstrap.min.css';

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
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')

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


/* Themes */
import '@/assets/less/common.less';
import '@/assets/less/fish.less';
import '@/assets/less/tables.less';
import '@/assets/less/night.less';
import '@/assets/less/day.less';

// Kick off worldstate refresh
store.dispatch('updateWorldstate');

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

setInterval(() => {store.dispatch('updateWorldstate');}, 30000);

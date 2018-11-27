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
Vue.use(VueAnalytics, {
  id: 'UA-47080716-6',
});

/* Leaflet */
import 'leaflet/dist/leaflet.css';

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

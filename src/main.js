import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

/* Bootstrap  */
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';

import 'bootswatch/dist/darkly/bootstrap.min.css';

import '@/assets/less/common.less';
import '@/assets/less/night.less';
import '@/assets/less/day.less';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

store.dispatch('updateWorldstate');

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

setInterval(() => {store.dispatch('updateWorldstate');}, 60000);

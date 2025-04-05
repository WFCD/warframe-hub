import Vue from 'vue';
/* Native notifications */
import VueNativeNotification from 'vue-native-notification';
import Vue3Notifications from '@kyvg/vue3-notification';

Vue.use(VueNativeNotification, { requestOnNotify: true });
Vue.use(Vue3Notifications);

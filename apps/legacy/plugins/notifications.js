import Vue from 'vue';
/* Native notifications */
import VueNativeNotification from 'vue-native-notification';
import Notifications from 'vue-notification';

Vue.use(VueNativeNotification, { requestOnNotify: true });
Vue.use(Notifications);

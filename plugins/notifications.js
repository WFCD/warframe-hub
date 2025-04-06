/* Native notifications */
import VueNativeNotification from 'vue-native-notification';
import Vue3Notifications from '@kyvg/vue3-notification';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((app) => {
  app.use(VueNativeNotification, { requestOnNotify: true });
  app.use(Vue3Notifications);
});

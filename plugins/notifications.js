/* Native notifications */
import VueNativeNotification from 'vue-native-notification';
import Vue3Notifications from '@kyvg/vue3-notification';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueNativeNotification, { requestOnNotify: true });
  nuxtApp.vueApp.use(Vue3Notifications);
});

import VueBinpackerPlugin from 'vue-binpacker-plugin';
import { defineNuxtPlugin } from '#app';

/* Vue Binpacker (Packery Replacement) */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueBinpackerPlugin);
});

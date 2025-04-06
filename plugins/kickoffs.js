import { defineNuxtPlugin } from '#app';
import { useCacheStore } from '~/store/cache';
import { useWorldstateStore } from '~/store/worldstate';

export default defineNuxtPlugin(({ nuxtApp }) => {
  // Kick off worldstate refresh
  useWorldstateStore().updateWorldstate();
  useCacheStore().updateRivens();
  useCacheStore().updateSynthData();

  const interval = process.env.VUE_APP_INTERVAL === undefined ? 30000 : Number(process.env.VUE_APP_INTERVAL);
  setInterval(async () => {
    return await useWorldstateStore().updateWorldstate();
  }, interval);
  setInterval(async () => {
    await useCacheStore().updateRivens();
    await useCacheStore().updateSynthData();
    await useCacheStore().updateWeapons();
    await useCacheStore().updateWarframes();
    await useCacheStore().updateMods();
  }, 3600000);
});

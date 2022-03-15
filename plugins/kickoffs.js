export default ({ app }) => {
  // Kick off worldstate refresh
  app.store.dispatch('worldstate/updateWorldstate');
  app.store.dispatch('cache/updateRivens');
  app.store.dispatch('cache/updateSynthData');

  const interval = process.env.VUE_APP_INTERVAL === undefined ? 30000 : Number(process.env.VUE_APP_INTERVAL);
  setInterval(async () => {
    return await app.store.dispatch('worldstate/updateWorldstate');
  }, interval);
  setInterval(async () => {
    await app.store.dispatch('cache/updateRivens');
    await app.store.dispatch('cache/updateSynthData');
    await app.store.dispatch('cache/updateWeapons');
    await app.store.dispatch('cache/updateWarframes');
    await app.store.dispatch('cache/updateMods');
  }, 3600000);
};

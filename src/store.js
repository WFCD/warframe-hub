'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import worldstate from '@/stores/worldstate';
import cache from '@/stores/cache';

const wsState = createPersistedState({
  paths: Object.keys(worldstate.state).map((k) => `worldstate.${k}`),
  key: 'vuex',
});

const cacheState = createPersistedState({
  paths: Object.keys(cache.state).map((k) => `cache.${k}`),
  key: 'cache',
});

Vue.use(Vuex);
const shouldPersist = (process.env.VUE_APP_PERSIST === undefined ? 'true' : process.env.VUE_APP_PERSIST) === 'true';
const store = new Vuex.Store({
  modules: { worldstate, cache },
  plugins: shouldPersist ? [wsState, cacheState] : [],
});

export default store;

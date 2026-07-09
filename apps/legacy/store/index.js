import createPersistedState from 'vuex-persistedstate';

import { state as worldstate } from '@/store/worldstate';
import { state as cache } from '@/store/cache';

const wsState = createPersistedState({
  paths: Object.keys(worldstate()).map((k) => `worldstate.${k}`),
  key: 'vuex',
});

const cacheState = createPersistedState({
  paths: Object.keys(cache()).map((k) => `cache.${k}`),
  key: 'cache',
});

const shouldPersist = (process.env.VUE_APP_PERSIST === undefined ? 'true' : process.env.VUE_APP_PERSIST) === 'true';

export const plugins = shouldPersist ? [wsState, cacheState] : [];

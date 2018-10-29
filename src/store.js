import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import fetch from 'node-fetch';

import components from '@/assets/json/components.json';

const apiBase = 'https://api.warframestat.us';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    worldstates: {
      pc: {},
      ps4: {},
      xb1: {}
    },
    platform: 'pc',
    components: components
  },
  mutations: {
    commitWs: (state, [platform, worldstate]) => {
      state.worldstates[platform] = worldstate;
    },
    commitPlatform: (state, platform) => {
      state.platform = platform;
    },
    commitComponentState: (state, [key, newState]) => {
      state.components[key].state = newState;
    }
  },
  actions: {
    async updateWorldstate({commit, getters}) {
      const res = await fetch(`${apiBase}/${getters.platform}`);
      const ws = await res.json();
      commit('commitWs', [getters.platform, ws]);
    }
  },
  getters: {
    worldstate: (state) => state.worldstates[state.platform],
    platform: (state) => state.platform,
    componentState: (state) => state.components,
  },
  plugins: [createPersistedState()]
});

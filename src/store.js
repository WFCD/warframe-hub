import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import fetch from 'node-fetch';

import components from '@/assets/json/components.json';
import trackables from '@/assets/json/trackables.json';

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
    theme: 'night',
    components: components,
    trackables: trackables,
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
    },
    setTheme: (state, [key]) => {
      state.theme = key;
    },
    commitRewardState: (state, [key, newState]) => {
      const toSet = state.trackables.rewardTypes[key];
      toSet.state = newState;
    },
    commitEventState: (state, [key, newState]) => {
      const toSet = state.trackables.eventTypes[key];
      toSet.state = newState;
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
    theme: (state) => state.theme,
    componentState: (state) => state.components,
    trackableState: (state) => state.trackables,
  },
  plugins: [createPersistedState()]
});

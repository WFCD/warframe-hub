'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import fetch from 'node-fetch';
import Notifier from '@/Notifier';

import components from '@/assets/json/components.json';
import trackables from '@/assets/json/trackables.json';
import fissurePlanets from '@/assets/json/planets.json';
import initialWorldstate from '@/assets/json/initialWorldstate.json';

const apiBase = 'https://api.warframestat.us';
let notifier;

const state = {
  worldstates: {
    pc: initialWorldstate.pc,
    ps4: initialWorldstate.ps4,
    xb1: initialWorldstate.xb1,
    switch: initialWorldstate.swi,
  },
  platform: 'pc',
  theme: 'night',
  components: components,
  trackables: trackables,
  fissurePlanets: fissurePlanets,
  soundFilters: [],
  notificationsAllowed: 'default',
  notifiedIds: {
    pc: [],
    ps4: [],
    xb1: [],
    switch: [],
  },
  poeMapToggles: {
    'Map Label-toggle-value': true,
    'Fishing-toggle-value': true,
    'Grineer Camp-toggle-value': true,
    'Oddity-toggle-value': true,
    'Cetus Wisp-toggle-value': true,
    'Vomvalyst Lure-toggle-value': true,
    'Cave Entrance-toggle-value': true,
  },
  vallisMapToggles: {
    'Map Label-toggle-value': true,
    'Fishing-toggle-value': true,
    'Fishing Spots-toggle-value': true,
    'Mining Spots-toggle-value': true,
    'K-Drive-toggle-value': true,
    'Oddity-toggle-value': true,
    'Somachord Tone-toggle-value': true,
    'Toroids-toggle-value': true,
    'Special Caves-toggle-value': true,
  },
};
const mutations = {
  commitWs: (state, [platform, worldstate]) => {
    state.worldstates[platform] = worldstate;
  },
  commitPlatform: (state, platform) => {
    state.platform = platform;
  },
  commitComponentDisplayMode: (state, [key, newState]) => {
    state.components[key].display = newState;
  },
  commitGridLayout: (state, [components]) => {
    state.grid.components = components;
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
  },
  commitFissurePlanetState: (state, [key, newState]) => {
    const toSet = state.fissurePlanets[key];
    toSet.state = newState;
  },
  commitSounds: (state, [sounds]) => {
    state.soundFilters = sounds;
  },
  commitNotificationAllowance: (state, [newState]) => {
    state.notificationsAllowed = newState;
  },
  notifiedIds: (state, [notifiedIds, platform]) => {
    state.notifiedIds[platform || state.platform] = notifiedIds;
  },
  commitComponent: (state, [key, newState]) => {
    state.components[key] = newState;
  },
  autoProgressNews: (state, [newState]) => {
    state.components.news.autoCycle = newState;
  },
  poeMapToggles: (state, [toggles]) => {
    state.poeMapToggles = toggles;
  },
  vallisMapToggles: (state, [toggles]) => {
    state.vallisMapToggles = toggles;
  },
};

const actions = {
  async updateWorldstate(context) {
    const { commit, getters } = context;
    const res = await fetch(`${apiBase}/${getters.platform}`, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    const ws = await res.json();
    commit('commitWs', [getters.platform, ws]);
    if (!notifier) {
      notifier = new Notifier(context);
    }
    notifier.checkNotifications();
  },
  async checkNotifPermissions({ commit, getters, dispatch }) {
    if (getters.notificationAllowance === 'granted') {
      return true;
    } else if (getters.notificationAllowance === 'denied') {
      return false;
    } else if (getters.notificationAllowance === 'default') {
      const result = await Vue.notification.requestPermission();
      if (result === 'granted') {
        Vue.notification.show(
          'Thanks!',
          {
            body: 'You can now receive notifications like this.',
            icon: 'https://warframestat.us/wfcd_logo_color.png',
          },
          {}
        );
      }
      commit('commitNotificationAllowance', [result]);
      return dispatch('checkNotifPermissions');
    }
  },
  async updateNotifiedIds({ commit, getters }) {
    const ws = getters.worldstate;
    const newIds = ws.alerts
      .map((alert) => alert.id)
      .concat(ws.invasions.map((invasion) => invasion.id))
      .concat(ws.news.map((item) => item.id))
      .concat(ws.events.map((event) => event.id))
      .concat([ws.sortie.id])
      .concat(ws.syndicateMissions.map((item) => item.id))
      .concat(ws.fissures.map((item) => item.id))
      .concat(ws.dailyDeals.map((deal) => deal.id))
      .concat(ws.flashSales.map((item) => item.id))
      .concat(ws.conclaveChallenges.map((item) => item.id))
      .concat([ws.cetusCycle.id])
      .concat([ws.voidTrader.id])
      .concat(ws.persistentEnemies.map((enemy) => enemy.pid))
      .concat((ws.nightwave || { activeChallenges: [] }).activeChallenges.map((challenge) => challenge.id));
    commit('notifiedIds', [newIds]);
  },
};
const getters = {
  worldstate: (state) => state.worldstates[state.platform],
  ostronSyndicate: (state) => {
    const worldstate = state.worldstates[state.platform];
    const filtered = (worldstate.syndicateMissions || []).filter((syndicate) => syndicate.syndicate === 'Ostrons');
    return filtered[0];
  },
  solarisSyndicate: (state) => {
    const worldstate = state.worldstates[state.platform];
    const filtered = (worldstate.syndicateMissions || []).filter(
      (syndicate) => syndicate.syndicate === 'Solaris United'
    );
    return filtered[0];
  },
  platform: (state) => state.platform,
  theme: (state) => state.theme,
  componentState: (state) => state.components,
  trackableState: (state) => state.trackables,
  fissurePlanetStates: (state) => state.fissurePlanets,
  sounds: (state) => state.soundFilters,
  notificationAllowance: (state) => state.notificationsAllowed,
  notifiedIds: (state) => state.notifiedIds[state.platform],
  poeMapToggles: (state) => state.poeMapToggles,
  vallisMapToggles: (state) => state.vallisMapToggles,
};

Vue.use(Vuex);
const shouldPersist = (process.env.VUE_APP_PERSIST === undefined ? 'true' : process.env.VUE_APP_PERSIST) === 'true';
var tStore;
if (shouldPersist) {
  tStore = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [createPersistedState()],
  });
} else {
  tStore = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [],
  });
}
const store = tStore;

export default store;

import Vue from 'vue';
import initialWorldstate from '@/static/json/initialWorldstate.json';
import components from '@/static/json/components.json';
import trackables from '@/static/json/trackables.json';
import fissurePlanets from '@/static/json/planets.json';
import Notifier from '@/services/Notifier';
import locales from '@/static/json/locales.json';
import { get } from '@/services/utilities';

const locale = Object.keys(locales).includes(navigator.language.substr(0, 2).toLowerCase())
  ? navigator.language.substr(0, 2).toLowerCase()
  : 'en';
const apiBase = 'https://api.warframestat.us' || process.env.VUE_APP_API_BASE;
let notifier;

// try to migrate old state
const migrate = window.localStorage.getItem('vuex') || '';
const parsedMigration = () => {
  let mig;
  try {
    mig = JSON.parse(migrate);
    delete mig.warframes;
    delete mig.mods;
    delete mig.weapons;
    delete mig.synthData;
    delete mig.rivens;
    return mig;
  } catch (e) {
    return {};
  }
};

export const state = () => {
  return parsedMigration().platform
    ? parsedMigration()
    : {
        worldstates: {
          pc: initialWorldstate.pc,
          ps4: initialWorldstate.ps4,
          xb1: initialWorldstate.xb1,
          switch: initialWorldstate.swi,
        },
        platform: 'pc',
        theme: 'night',
        components,
        trackables,
        fissurePlanets,
        fissureDisplays: 'fissures-storms',
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
        locale,
        bountyToggles: {},
      };
};
export const mutations = {
  commitWs: (state, [platform, worldstate]) => {
    state.worldstates[platform] = worldstate;
  },
  commitLocale: (state, locale) => {
    state.locale = locale;
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
  commitFissureDisplaysState: (state, [value]) => {
    state.fissureDisplays = value;
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
  toggleBountiesOpen: (state, [bountyType, newState]) => {
    state.bountyToggles[bountyType] = newState;
  },
};
export const actions = {
  async updateWorldstate(context) {
    const { commit, getters } = context;
    const ws = await get(`${apiBase}/${getters.platform}/?language=${getters.locale}`, {
      headers: {
        'Accept-Language': getters.locale,
      },
    });
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
      if (!Vue.notification) return false;
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
  updateNotifiedIds({ commit, getters }) {
    const ws = getters.worldstate;
    if (!ws) return;
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
      .concat([`arbitration:${new Date(ws.arbitration.expiry).getTime()}`])
      // .concat(ws.persistentEnemies.map((enemy) => enemy.pid))
      .concat((ws.nightwave || { activeChallenges: [] }).activeChallenges.map((challenge) => challenge.id))
      .concat([ws.sentientOutposts.id]);
    commit('notifiedIds', [newIds]);
  },
};
export const getters = {
  worldstate: (state) => state.worldstates[state.platform],
  ostronSyndicate: (state) => {
    const worldstate = state.worldstates[state.platform];
    return (worldstate.syndicateMissions || []).filter((syndicate) => syndicate.id.includes('CetusSyndicate'))[0];
  },
  solarisSyndicate: (state) => {
    const worldstate = state.worldstates[state.platform];
    return (worldstate.syndicateMissions || []).filter((syndicate) => syndicate.id.includes('SolarisSyndicate'))[0];
  },
  entratiSyndicate: (state) => {
    const worldstate = state.worldstates[state.platform];
    return (worldstate.syndicateMissions || []).filter((syndicate) => syndicate.id.includes('EntratiSyndicate'))[0];
  },
  locale: (state) => state.locale || 'en',
  platform: (state) => state.platform || 'pc',
  theme: (state) => state.theme || 'night',
  componentState: (state) => state.components,
  trackableState: (state) => state.trackables,
  fissurePlanetStates: (state) => state.fissurePlanets || fissurePlanets,
  fissureDisplays: (state) => state.fissureDisplays || 'fissures-storms',
  sounds: (state) => state.soundFilters,
  notificationAllowance: (state) => state.notificationsAllowed,
  notifiedIds: (state) => state.notifiedIds[state.platform],
  poeMapToggles: (state) => state.poeMapToggles,
  vallisMapToggles: (state) => state.vallisMapToggles,
  bountyToggles: (state) => state.bountyToggles,
};

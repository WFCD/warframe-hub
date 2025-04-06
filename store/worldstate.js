import Vue from 'vue';
import trackables from 'static/json/trackables.js';
import initialWorldstate from '@/static/json/initialWorldstate.json';
import components from '@/static/json/components.json';
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

const baseState = {
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
  deimosMapToggles: {
    'Map Label-toggle-value': true,
    'Teleporter-toggle-value': true,
    'Cave Entrance-toggle-value': true,
    'Necramech-toggle-value': false,
    'Mother Bounty-toggle-value': false,
    'K-Drive-toggle-value': true,
  },
  locale,
  bountyToggles: {},
};

// TODO: Migrate existing persisted vuex data on clients

export const useWorldstateStore = defineStore('worldstate', {
  persist: true,
  state: () => (parsedMigration().platform ? parsedMigration() : baseState),
  getters: {
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
    deimosMapToggles: (state) => state.deimosMapToggles || baseState.deimosMapToggles,
    bountyToggles: (state) => state.bountyToggles,
  },
  actions: {
    commitWs: ([platform, worldstate]) => {
      this.worldstates[platform] = worldstate;
    },
    commitLocale: (locale) => {
      this.locale = locale;
    },
    commitPlatform: (platform) => {
      this.platform = platform;
    },
    commitComponentDisplayMode: ([key, newState]) => {
      this.components[key].display = newState;
    },
    commitGridLayout: ([components]) => {
      this.grid.components = components;
    },
    setTheme: ([key]) => {
      this.theme = key;
    },
    commitRewardState: ([key, newState]) => {
      const toSet = this.trackables.rewardTypes[key];
      toSet.state = newState;
    },
    commitEventState: ([key, newState]) => {
      const toSet = this.trackables.eventTypes[key];
      toSet.state = newState;
    },
    commitFissurePlanetState: ([key, newState]) => {
      const toSet = this.fissurePlanets[key];
      toSet.state = newState;
    },
    commitFissureDisplaysState: ([value]) => {
      this.fissureDisplays = value;
    },
    commitSounds: ([sounds]) => {
      this.soundFilters = sounds;
    },
    commitNotificationAllowance: ([newState]) => {
      this.notificationsAllowed = newState;
    },
    notifiedIds: ([notifiedIds, platform]) => {
      this.notifiedIds[platform || this.platform] = notifiedIds;
    },
    commitComponent: ([key, newState]) => {
      this.components[key] = newState;
    },
    autoProgressNews: ([newState]) => {
      this.components.news.autoCycle = newState;
    },
    commitPoeMapToggles: ([toggles]) => {
      this.poeMapToggles = toggles;
    },
    commitVallisMapToggles: ([toggles]) => {
      this.vallisMapToggles = toggles;
    },
    commitDeimosMapToggles: ([toggles]) => {
      this.deimosMapToggles = toggles;
    },
    toggleBountiesOpen: ([bountyType, newState]) => {
      this.bountyToggles[bountyType] = newState;
    },

    async updateWorldstate() {
      const ws = await get(`${apiBase}/${this.platform}/?language=${this.locale}`, {
        headers: {
          'Accept-Language': this.locale,
        },
      });
      this.commitWs([this.platform, ws]);
      if (!notifier) {
        notifier = new Notifier();
      }
      notifier.checkNotifications();
    },
    async checkNotifPermissions() {
      if (this.notificationAllowance === 'granted') {
        return true;
      } else if (this.notificationAllowance === 'denied') {
        return false;
      } else if (this.notificationAllowance === 'default') {
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
        this.commitNotificationAllowance([result]);
      }
    },
    updateNotifiedIds() {
      const ws = this.worldstate;
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
        .concat([ws.zarimanCycle.id])
        .concat([ws.voidTrader.id])
        .concat(ws.arbitration && [`arbitration:${new Date(ws.arbitration.expiry).getTime()}`])
        // .concat(ws.persistentEnemies.map((enemy) => enemy.pid))
        .concat((ws.nightwave || { activeChallenges: [] }).activeChallenges.map((challenge) => challenge.id))
        .concat([ws.sentientOutposts.id])
        .filter((id) => id);
      this.notifiedIds([newIds]);
    },
  },
});

import { useWorldstateStore } from './worldstate';
import { get } from '@/services/utilities';
const safeCommit = (fn) => {
  try {
    fn();
  } catch (e) {
    // throw away error
  }
};

// TODO: Migrate existing persisted vuex data on clients

export const useCacheStore = defineStore('cache', {
  persist: true,
  state: () => ({
    rivens: {
      pc: [],
      ps4: [],
      xb1: [],
      switch: [],
    },
    synthData: [],
    warframes: [],
    weaponds: [],
    mods: [],
  }),
  getters: {
    rivens: (state) => state.rivens,
    synthData: (state) => state.synthData,
    warframes: (state) => state.warframes,
    weapons: (state) => state.weapons,
    mods: (state) => state.mods,
  },
  actions: {
    commitRivens: ([platform, rivens]) => {
      if (!this.rivens || Array.isArray(this.rivens)) {
        this.rivens = {
          pc: [],
          ps4: [],
          xb1: [],
          switch: [],
        };
      }
      this.rivens[platform] = rivens;
    },
    commitSynthData: ([synthData]) => {
      this.synthData = synthData;
    },
    commitFrameData: ([warframes]) => {
      this.warframes = warframes;
    },
    commitWeaponData: ([weapons]) => {
      this.weapons = weapons;
    },
    commitModData: ([mods]) => {
      this.mods = mods;
    },
  },

  async updateRivens() {
    const res = await fetch(
      `https://www.warframe.com/repos/weeklyRivens${useWorldstateStore().platform.toUpperCase()}.json`
    );
    const raw = await res.text();
    if (!(raw && raw.length)) return;
    const rivens = JSON.parse(raw.replace(/NaN/g, 0).replace(/WARNING:.*\n/, ''));
    this.commitRivens([useWorldstateStore().locale, rivens]);
  },
  async updateSynthData() {
    const res = await get(`https://api.warframestat.us/synthTargets/?language=${useWorldstateStore().locale}`);
    safeCommit(() => this.commitSynthData(res));
  },
  async updateWarframes() {
    const res = await get(
      `https://api.warframestat.us/warframes?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${useWorldstateStore().locale}`
    );
    safeCommit(() => this.commitFrameData(res));
  },
  async updateWeapons() {
    const res = await get(
      `https://api.warframestat.us/weapons?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${useWorldstateStore().locale}`
    );
    safeCommit(() => this.commitWeaponData(res));
  },
  async updateMods() {
    const res = await get(
      `https://api.warframestat.us/mods?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${useWorldstateStore().locale}`
    );
    safeCommit(() => this.commitModData(res));
  },
});
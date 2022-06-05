import { get } from '@/services/utilities';
const safeCommit = (commit, id, data) => {
  try {
    commit(id, [data]);
  } catch (e) {
    // throw away error
  }
};

export const state = () => ({
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
});
export const actions = {
  async updateRivens({ commit, rootGetters }) {
    const res = await fetch(
      `https://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivens${rootGetters['worldstate/platform'].toUpperCase()}.json`
    );
    const raw = await res.text();
    if (!(raw && raw.length)) return;
    const rivens = JSON.parse(raw.replace(/NaN/g, 0).replace(/WARNING:.*\n/, ''));
    commit('commitRivens', [rootGetters['worldstate/platform'], rivens]);
  },
  async updateSynthData({ commit, rootGetters }) {
    const res = await get(`https://api.warframestat.us/synthTargets/?language=${rootGetters['worldstate/locale']}`);
    safeCommit(commit, 'commitSynthData', res);
  },
  async updateWarframes({ commit, rootGetters }) {
    const res = await get(
      `https://api.warframestat.us/warframes?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${rootGetters['worldstate/locale']}`
    );
    safeCommit(commit, 'commitFrameData', res);
  },
  async updateWeapons({ commit, rootGetters }) {
    const res = await get(
      `https://api.warframestat.us/weapons?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${rootGetters['worldstate/locale']}`
    );
    safeCommit(commit, 'commitWeaponData', res);
  },
  async updateMods({ commit, rootGetters }) {
    const res = await get(
      `https://api.warframestat.us/mods?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${rootGetters['worldstate/locale']}`
    );
    safeCommit(commit, 'commitModData', res);
  },
};
export const mutations = {
  commitRivens: (state, [platform, rivens]) => {
    if (!state.rivens || Array.isArray(state.rivens)) {
      state.rivens = {
        pc: [],
        ps4: [],
        xb1: [],
        switch: [],
      };
    }
    state.rivens[platform] = rivens;
  },
  commitSynthData: (state, [synthData]) => {
    state.synthData = synthData;
  },
  commitFrameData: (state, [warframes]) => {
    state.warframes = warframes;
  },
  commitWeaponData: (state, [weapons]) => {
    state.weapons = weapons;
  },
  commitModData: (state, [mods]) => {
    state.mods = mods;
  },
};
export const getters = {
  rivens: (state) => state.rivens,
  synthData: (state) => state.synthData,
  warframes: (state) => state.warframes,
  weapons: (state) => state.weapons,
  mods: (state) => state.mods,
};

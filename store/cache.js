import json5 from 'json5';
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
    try {
      const res = await fetch(
        `https://www-static.warframe.com/repos/weeklyRivens${rootGetters['worldstate/platform'].toUpperCase()}.json`
      );

      if (!res.ok) {
        console.error(`Failed to fetch rivens: ${res.status} ${res.statusText}`);
        commit('commitRivens', [rootGetters['worldstate/platform'], []]);
        return;
      }

      const raw = await res.text();

      if (!(raw && raw.length)) {
        commit('commitRivens', [rootGetters['worldstate/platform'], []]);
        return;
      }

      const rivens = json5.parse(raw);
      commit('commitRivens', [rootGetters['worldstate/platform'], rivens]);
    } catch (e) {
      console.error(e);
      commit('commitRivens', [rootGetters['worldstate/platform'], []]);
    }
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

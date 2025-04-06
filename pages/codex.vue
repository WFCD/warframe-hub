<template>
  <div />
</template>
<script>
import { useCacheStore } from '~/store/cache';
export default {
  name: 'CodexView',
  data() {
    return {
      data: {
        warframes: [],
        weapons: [],
        mods: [],
      },
      filter: null,
      loading: false,
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
    };
  },
  watch: {
    warframes(val) {
      this.loading = true;
      this.data.warframes = val;
      this.loading = false;
      this.totalRows = val.length + this.data.weapons.length + this.data.mods.length;
    },
    weapons(val) {
      this.loading = true;
      this.data.weapons = val;
      this.loading = false;
      this.totalRows = val.length + this.data.warframes.length + this.data.mods.length;
    },
    mods(val) {
      this.loading = true;
      this.data.mods = val;
      this.loading = false;
      this.totalRows = val.length + this.data.weapons.length + this.data.warframes.length;
    },
  },
  mounted() {
    if (useCacheStore().mods) {
      this.data.mods = useCacheStore().mods;
      this.totalRows = this.data.mods.length + this.data.warframes.length + this.data.weapons.length;
    } else {
      this.data.mods = [];
      useCacheStore().updateMods();
    }
    if (useCacheStore().warframes) {
      this.data.warframes = useCacheStore().warframes;
      this.totalRows = this.data.mods.length + this.data.warframes.length + this.data.weapons.length;
    } else {
      this.data.warframes = [];
      useCacheStore().updateWarframes();
    }
    if (useCacheStore().weapons) {
      this.data.weapons = useCacheStore().weapons;
      this.totalRows = this.data.mods.length + this.data.warframes.length + this.data.weapons.length;
    } else {
      this.data.weapons = [];
      useCacheStore().updateWeapons();
    }
  },
  methods: {
    toTitleCase(str) {
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

<template>
  <div />
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'codex-view',
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
    warframes: function (val) {
      this.loading = true;
      this.data.warframes = val;
      this.loading = false;
      this.totalRows = val.length + this.data.weapons.length + this.data.mods.length;
    },
    weapons: function (val) {
      this.loading = true;
      this.data.weapons = val;
      this.loading = false;
      this.totalRows = val.length + this.data.warframes.length + this.data.mods.length;
    },
    mods: function (val) {
      this.loading = true;
      this.data.mods = val;
      this.loading = false;
      this.totalRows = val.length + this.data.weapons.length + this.data.warframes.length;
    },
  },
  computed: {
    ...mapGetters('cache', ['warframes', 'mods', 'weapons']),
  },
  methods: {
    toTitleCase: function (str) {
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
    onFiltered: function (filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  mounted() {
    if (this.mods) {
      this.data.mods = this.mods;
      this.totalRows = this.data.mods.length + this.data.warframes.length + this.data.weapons.length;
    } else {
      this.data.mods = [];
      this.$store.dispatch('cache/updateMods');
    }
    if (this.warframes) {
      this.data.warframes = this.warframes;
      this.totalRows = this.data.mods.length + this.data.warframes.length + this.data.weapons.length;
    } else {
      this.data.warframes = [];
      this.$store.dispatch('cache/updateWarframes');
    }
    if (this.weapons) {
      this.data.weapons = this.weapons;
      this.totalRows = this.data.mods.length + this.data.warframes.length + this.data.weapons.length;
    } else {
      this.data.weapons = [];
      this.$store.dispatch('cache/updateWeapons');
    }
  },
};
</script>

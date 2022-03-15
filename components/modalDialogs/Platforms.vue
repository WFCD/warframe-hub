<template>
  <b-form-group label="Platform">
    <b-form-radio-group
      id="platform-radios"
      v-model="platform"
      stacked
      name="platform radios"
      class="settings-group"
      @change="savePlatform"
    >
      <b-form-radio v-for="p in platforms" :key="p.key" :value="p.key">
        <i :class="`${p.icon} fa-lg`" :style="platformIconStyle"></i>
      </b-form-radio>
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
import { mapGetters } from 'vuex';
import platforms from '@/static/json/platforms.json';

export default {
  name: 'PlatformsDialog',
  data() {
    return {
      platformIconStyle: {
        color: 'white',
        'margin-top': '3px',
        'padding-right': '10px',
      },
      platformLabelStyle: {
        'flex-grow': 1,
      },
      platforms,
    };
  },
  computed: {
    ...mapGetters('worldstate', { readPlatform: 'platform' }),
    platform: {
      set(platform) {
        this.savePlatform(platform);
      },
      get() {
        return this.readPlatform;
      },
    },
  },
  methods: {
    savePlatform(platform) {
      this.$store.commit('worldstate/commitPlatform', platform);
      this.$store.dispatch('worldstate/updateWorldstate');
      this.$store.dispatch('cache/updateRivens');
    },
  },
};
</script>

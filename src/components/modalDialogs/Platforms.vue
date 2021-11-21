<template>
  <b-form-group label="Platform">
    <b-form-radio-group
      id="platform-radios"
      stacked
      v-model="platform"
      name="platform radios"
      v-on:change="savePlatform"
      class="settings-group"
    >
      <b-form-radio v-for="platform in this.platforms" :key="platform.key" :value="platform.key">
        <i :class="`${platform.icon} fa-lg`" :style="platformIconStyle"></i>
      </b-form-radio>
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
import platforms from '@/assets/json/platforms.json';

export default {
  name: 'platforms-dialog',
  data() {
    return {
      platform: this.$store.getters.platform,
      platformIconStyle: {
        color: 'white',
        'margin-top': '3px',
        'padding-right': '10px',
      },
      platformLabelStyle: {
        'flex-grow': 1,
      },
      platforms: platforms,
    };
  },
  methods: {
    savePlatform(platform) {
      this.$store.commit('commitPlatform', platform);
      this.$store.dispatch('updateWorldstate');
      this.$store.dispatch('updateRivens');
    },
  },
};
</script>

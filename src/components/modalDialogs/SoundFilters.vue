<template>
  <div id="soundsTabBody">
    Checking the checkbox next to an option will allow a sound to be played for those new items.

    <div class="tab-wrap">
      <b-form-group label="Sound Filters">
        <b-form-checkbox-group
          id="sound-checks"
          name="Sound Filters"
          :options="options"
          v-model="activeSounds"
          v-on:change="(vals) => updateSounds(vals)"
          switches
          stacked
          class="settings-group"
        >
        </b-form-checkbox-group>
      </b-form-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SoundOptionsTab',
  data() {
    return {
      options: [
        {
          value: 'night',
          text: 'Eidolon Roar to Start the Night',
        },
        {
          value: 'alert',
          text: 'Alert tone',
        },
        {
          value: 'invasion',
          text: 'Invasion Tone',
        },
      ],
    };
  },
  computed: {
    activeSounds: {
      get: function() {
        return JSON.parse(JSON.stringify(this.$store.getters.sounds));
      },
      set: function() {},
    },
  },
  methods: {
    updateSounds(enabledSounds) {
      this.$store.commit('commitSounds', [JSON.parse(JSON.stringify(enabledSounds))]);
    },
  },
};
</script>

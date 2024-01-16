import { mapGetters } from 'vuex';

const eidolon = '/audio/eidolon.mp3';

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
    ...mapGetters('worldstate', ['sounds']),
    activeSounds: {
      get() {
        return JSON.parse(JSON.stringify(this.sounds));
      },
      set(enabledSounds) {
        this.$store.commit('worldstate/commitSounds', [JSON.parse(JSON.stringify(enabledSounds))]);
      },
    },
  },
  render() {
    const testAudio = async () => {
      const audio = new Audio(eidolon);
      audio.volume = 1;
      await audio.play();
    };
    return (
      <b-tab title="Sound Filters">
        <div id="soundsTabBody">
          Checking the checkbox next to an option will allow a sound to be played for those new items.
          <div class="tab-wrap fit-height pt-3">
            <b-form-group label="Sound Filters">
              <b-form-checkbox-group
                id="sound-checks"
                v-model={this.activeSounds}
                name="Sound Filters"
                options={this.options}
                switches
                stacked
                class="settings-group"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-btn variant={'outline-warn'} onClick={testAudio} style={{ borderColor: 'orange' }}>
              Test Audio
            </b-btn>
          </div>
        </div>
      </b-tab>
    );
  },
};

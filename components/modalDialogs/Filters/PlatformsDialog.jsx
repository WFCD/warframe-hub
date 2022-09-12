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
    };
  },
  computed: {
    ...mapGetters('worldstate', { readPlatform: 'platform' }),
    platform: {
      set(platform) {
        this.$store.commit('worldstate/commitPlatform', platform);
        this.$store.dispatch('worldstate/updateWorldstate');
        this.$store.dispatch('cache/updateRivens');
      },
      get() {
        return this.readPlatform;
      },
    },
  },
  render() {
    return (
      <b-tab title="Platform">
        <b-form-group label="Platform">
          <b-form-radio-group
            id="platform-radios"
            v-model={this.platform}
            stacked
            name="platform radios"
            class="settings-group"
          >
            {Object.values(platforms).map((p) => {
              return (
                <b-form-radio key={p.key} value={p.key}>
                  <i class={`${p.icon} fa-lg`} style={this.platformIconStyle}></i>
                </b-form-radio>
              );
            })}
          </b-form-radio-group>
        </b-form-group>
      </b-tab>
    );
  },
};

import { useWorldstateStore } from '~/store/worldstate';
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
    platform: {
      set(platform) {
        useWorldstateStore().commitPlatform(platform);
        useWorldstateStore().updateWorldstate();
        useWorldstateStore().updateRivens();
      },
      get() {
        return useWorldstateStore().platform;
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

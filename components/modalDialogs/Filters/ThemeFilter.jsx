import { mapGetters } from 'vuex';
import themes from '@/static/json/themes.json';

export default {
  name: 'ThemeFilter',
  data() {
    return {
      themeIconStyle: {
        color: 'white',
        'margin-top': '3px',
        'padding-right': '10px',
      },
      themeLabelStyle: {
        'flex-grow': 1,
      },
    };
  },
  computed: {
    theme: {
      get() {
        return this.rawTheme;
      },
      set(theme) {
        this.$store.commit('worldstate/setTheme', [theme]);
      },
    },
    ...mapGetters('worldstate', {
      rawTheme: 'theme',
    }),
  },
  render() {
    return (
      <b-tab title="Theme">
        <b-form-group label="Theme">
          <b-form-radio-group
            id="theme-radios"
            v-model={this.theme}
            stacked
            name="theme radios"
            class="settings-group themeTabWrapper"
          >
            {themes.map((t) => {
              return (
                <b-form-radio key={t.key} value={t.key}>
                  <i className={t.faclass} style={this.themeIconStyle}></i>
                  <span style={this.themeLabelStyle}>{t.display}</span>
                </b-form-radio>
              );
            })}
          </b-form-radio-group>
        </b-form-group>
      </b-tab>
    );
  },
};

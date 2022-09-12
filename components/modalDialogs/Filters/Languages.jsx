import { mapGetters } from 'vuex';
import locales from 'static/json/locales.json';

export default {
  name: 'LanguagesDialog',
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
    ...mapGetters('worldstate', ['locale']),
    lang: {
      set(locale) {
        this.saveLocale(locale);
      },
      get() {
        return this.locale;
      },
    },
  },
  methods: {
    saveLocale(locale) {
      this.$store.commit('worldstate/commitLocale', locale);
      this.$i18n.locale = locale;
      this.$store.dispatch('worldstate/updateWorldstate');
    },
  },
  render() {
    return (
      <b-tab title={'Language'}>
        <b-form-group label="Language">
          <b-form-radio-group
            id="locale-radios"
            v-model={this.lang}
            stacked
            name="language radios"
            class="settings-group"
            change={this.saveLocale}
          >
            {locales.map((locale) => {
              return (
                <b-form-radio key={locale.key} value={locale.key}>
                  {locale.display}
                </b-form-radio>
              );
            })}
          </b-form-radio-group>
        </b-form-group>
      </b-tab>
    );
  },
};

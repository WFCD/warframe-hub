<template>
  <b-form-group label="Language">
    <b-form-radio-group
      id="locale-radios"
      v-model="lang"
      stacked
      name="language radios"
      class="settings-group"
      @change="saveLocale"
    >
      <b-form-radio v-for="locale in locales" :key="locale.key" :value="locale.key">
        {{ locale.display }}
      </b-form-radio>
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
import { mapGetters } from 'vuex';
import locales from '@/static/json/locales.json';

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
      locales,
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
};
</script>

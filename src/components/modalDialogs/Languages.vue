<template>
  <b-form-group label="Language">
    <b-form-radio-group
      id="locale-radios"
      stacked
      v-model="locale"
      name="language radios"
      v-on:change="saveLocale"
      class="settings-group"
    >
      <b-form-radio v-for="locale in this.locales" :key="locale.key" :value="locale.key">
        {{ locale.display }}
      </b-form-radio>
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
import locales from '@/assets/json/locales.json';
import { mapGetters } from 'vuex';

export default {
  name: 'languages-dialog',
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
      locales: locales,
    };
  },
  computed: {
    ...mapGetters('worldstate', ['locale']),
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

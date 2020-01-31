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

export default {
  name: 'Lanuages',
  data() {
    return {
      locale: this.$store.getters.locale,
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
  methods: {
    saveLocale(locale) {
      this.$store.commit('commitLocale', locale);
      this.$i18n.locale = locale;
      this.$store.dispatch('updateWorldstate');
    },
  },
};
</script>

<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="app">
    <notifications group="hub" :max="5" :duration="30000" position="bottom right" />
    <Navbar />
    <Settings />
    <About />
    <Nuxt />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Navbar from '@/components/Navbar.vue';
import Settings from '@/components/modalDialogs/Settings.vue';
import About from '@/components/modalDialogs/About.vue';
import themes from '@/static/json/themes.json';
export default {
  components: {
    Navbar,
    Settings,
    About,
  },
  computed: {
    ...mapGetters('worldstate', {
      rawTheme: 'theme',
    }),
    theme() {
      return themes.find((theme) => theme.key === this.rawTheme).className;
    },
  },
  watch: {
    theme(newTheme, oldTheme) {
      oldTheme.split(' ').forEach((ot) => document.body.classList.remove(ot));
      newTheme.split(' ').forEach((nt) => document.body.classList.add(nt));
    },
  },
  mounted() {
    this.theme.split(' ').forEach((t) => document.body.classList.add(t));
  },
};
</script>

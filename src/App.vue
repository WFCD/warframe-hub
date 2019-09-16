<template>
  <div id="app" :class="theme.className">
    <notifications group="hub" :max="5" :duration="30000" position="bottom right" />
    <Navbar />
    <Settings />
    <About />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Settings from '@/components/modalDialogs/Settings.vue';
import About from '@/components/modalDialogs/About.vue';
import themes from '@/assets/json/themes.json';

export default {
  name: 'app',
  components: {
    Navbar,
    Settings,
    About,
  },
  computed: {
    theme() {
      return themes.find((theme) => theme.key === this.$store.getters.theme);
    },
  },
};
</script>

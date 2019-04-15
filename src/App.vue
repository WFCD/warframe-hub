<template>
  <div id="app" class="theme-dark h-screen w-full">
    <Navbar class="card " />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
//import Settings from '@/components/modalDialogs/Settings.vue';
//import About from '@/components/modalDialogs/About.vue';

export default {
  name: 'app',
  components: {
    Navbar
  }
};
</script>

<style>
@import 'assets/styles/tailwind.postcss';
#app {
  padding-top: 0px !important;
}
</style>

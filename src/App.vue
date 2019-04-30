<template>
  <div id="app" class=" theme-eidelon min-h-screen  w-full">
    <Navbar class="card " />
    <router-view class="" />
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
</style>

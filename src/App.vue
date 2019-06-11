<template>
  <div id="app" :class="this.$store.getters.theme">
    <notifications group="hub" :max="5" :duration="30000" position="bottom right" />
    <Navbar />
    <Settings />
    <About />
    <router-view/>
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar.vue';
  import Settings from '@/components/modalDialogs/Settings.vue';
  import About from '@/components/modalDialogs/About.vue';

  export default {
    name: 'app',
    components: {
      Navbar,
      Settings,
      About,
    }
  };

</script>

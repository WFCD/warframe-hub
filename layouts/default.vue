<template>
  <div
    :class="
      darkmode
        ? 'antialiased theme-dark bg-primary min-h-screen '
        : 'antialiased bg-primary  min-h-screen '
    "
  >
    <Navbar
      class="elevation-24 bg-green-700 py-2 w-full fixed z-10 pin-t"
      role="navigation"
    />
    <nuxt class="py-16 pt-12  min-h-screen" role="main" />
  </div>
</template>
<style></style>
<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  computed: {
    darkmode: function() {
      return true
    }
  },
  mounted() {
    this.$store.dispatch('updateWorldstate')
    const interval =
      process.env.VUE_APP_INTERVAL === undefined
        ? 30000
        : Number(process.env.VUE_APP_INTERVAL)
    setInterval(() => {
      this.$store.dispatch('updateWorldstate')
    }, interval)
  }
}
</script>

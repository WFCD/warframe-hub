<template>
  <nav class="flex items-center flex-wrap bg-navbar px-2 ">
    <div class="flex items-center flex-no-shrink text-white mr-6">
      <span class="text-navbarbrand  font-semibold text-xl tracking-tight"
        >Warframe Hub</span
      >
    </div>
    <div class="flex flex-grow">
      <router-link to="/" exact class="mr-3">
        <span class="-ml-2 mr-3"
          ><fa icon="moon" fixed-width class="fill-current"
        /></span>
        Timers</router-link
      >
      <router-link to="/riven" exact>
        <span class="-ml-2 mr-1"
          ><fa icon="sun" fixed-width class="fill-current"
        /></span>
        Riven</router-link
      >
    </div>
  </nav>
</template>

<style></style>

<script>
export default {
  data() {
    return {
      open: false,
      opend1: false,
      selected: ''
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    setSelectedlang(value) {
      // eslint-disable-next-line
      console.log(this.$i18n)
      this.$i18n.locale = value.short
      this.$store.commit('setlang', value)
    },
    setDarkmode(value) {
      value = !value
      this.$store.commit('darkmodeswitch', value)
    },
    setSelectedplatform(value) {
      // eslint-disable-next-line
      console.log(this.$i18n)
      this.$store.commit('setplatform', value)
    }
  }
}
</script>

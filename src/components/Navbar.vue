<template>
  <b-navbar toggleable="md" type="dark" variant="primary" fixed="top">
    <b-navbar-brand href="/">Warframe Hub</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>

        <b-nav-item><router-link to="/">Timers</router-link></b-nav-item>

        <b-nav-item-dropdown text="Plains" left>

          <!-- <b-dropdown-item href="#"><router-link to="/map">Map</router-link></b-dropdown-item> -->
          <b-dropdown-item><router-link to="/fish">Fishing Data</router-link></b-dropdown-item>
          <b-dropdown-item><router-link to="/howtofish">How to Fish</router-link></b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- <b-nav-item-dropdown text="Projects" left>
          <b-dropdown-item href="https://drops.warframestat.us" target="_blank">Drops</b-dropdown-item>
          <b-dropdown-item href="https://genesis.warframestat.us" target="_blank">Genesis</b-dropdown-item>
          <b-dropdown-item href="https://docs.warframestat.us" target="_blank">API Docs</b-dropdown-item>
          <b-dropdown-item href="https://warframestat.us" target="_blank">Status</b-dropdown-item>
        </b-nav-item-dropdown> -->
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown text="Components" right>
          <!-- Components list here -->
          <b-dropdown-item href="#"
            v-for="component in getComponents"
            :key="component.key"
            :class="{active: component.state}"
            v-on:click.prevent.stop="updateComponentState(component.key, !component.state)"
            >
            {{ component.display }}
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- Theme list here -->
        <!-- <b-nav-item-dropdown text="Theme" right>
          <b-dropdown-item href="#">Night</b-dropdown-item>
          <b-dropdown-item href="#">Retro</b-dropdown-item>
          <b-dropdown-item href="#">Eidolon</b-dropdown-item>
          <b-dropdown-item href="#">None</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <b-nav-item-dropdown text="Platform" right class="text-center">
          <!-- Platform list here -->
          <b-dropdown-item
            href="#"
            v-for="platform in this.platforms"
            :key="platform.key"
            :style="platformSelectionParent"
            :class="{active: $store.getters.platform === platform.key}"
            v-on:click.stop.prevent="savePlatform(platform.key); $event.stopPropagation();"
            >
            <HubImg :src="platformImg[platform.key]"
              :name="platform.display"
              width="16px"
              height="16px"
              :style="platformIconStyle"
              />
            <span :style="platformLabelStyle">{{ platform.display }}</span>
          </b-dropdown-item>

        </b-nav-item-dropdown>

        <!-- Filter grouping list here -->
        <!-- <b-nav-item-dropdown text="Filters" right>
          <b-dropdown-item href="#">Notification Filters</b-dropdown-item>
          <b-dropdown-item href="#">Fissure Filters</b-dropdown-item>
          <b-dropdown-item href="#">Sounds</b-dropdown-item>
        </b-nav-item-dropdown> -->

      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<style scoped>
.navbar.navbar-dark.bg-primary {
  background-color: #1a5072!important;
}
</style>
<!-- Navbar.vue -->

<script>
  import HubImg from '@/components/HubImg.vue'
  import pc from '@/assets/img/platforms/pc.svg'
  import ps4 from '@/assets/img/platforms/ps4.svg'
  import xb1 from '@/assets/img/platforms/xb1.svg'

  import platforms from '@/assets/json/platforms.json'

  export default {
    name: 'Navbar',
    components: {
      HubImg
    },
    data() {
      return {
        platformIconStyle: {
          filter: 'invert(100%)',
          'margin-top': '3px'
        },
        platformSelectionParent: {
          display: 'flex',
          'justify-content': 'space-between',
          padding: '10px 20px',
          'text-align': 'center',
        },
        platformLabelStyle: {
          'flex-grow': 1,
        },
        platforms: platforms,
        platformImg: {
          pc: pc,
          ps4: ps4,
          xb1: xb1
        }
      }
    },
    methods: {
      savePlatform(platform) {
        this.$store.commit('commitPlatform', platform);
        this.$store.dispatch('updateWorldstate');
      },
      updateComponentState(key, state) {
        this.$store.commit('commitComponentState', [key, state]);
      }
    },
    computed: {
      getComponents() {
        return this.$store.getters.componentState;
      }
    }
  }
</script>

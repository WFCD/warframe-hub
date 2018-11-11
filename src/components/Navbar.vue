<template>
  <b-navbar toggleable="md" type="dark" variant="primary" fixed="top">
    <b-navbar-brand href="/">Warframe Hub</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item><router-link to="/"><i class="fas fa-clock faIconStyle"></i> Timers</router-link></b-nav-item>

        <b-nav-item-dropdown text="<i class='fas fa-mountain fa-sm faIconStyle'></i> Plains" left class="text-center">
          <b-dropdown-item>
            <router-link to="/poe/map">
              <i class="fas fa-map-marker-alt faIconStyle"></i>
              <span :style="navItemLabelStyle">Map</span>
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item>
            <router-link to="/poe/fish" :style="navItemParent">
              <i class="fas fa-fish faIconStyle"></i>
              <span :style="navItemLabelStyle">Fishing Data</span>
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item>
            <router-link to="/poe/fish/howto" :style="navItemParent">
              <i class="fas fa-info faIconStyle"></i>
              <span :style="navItemLabelStyle">How to Fish</span>
            </router-link>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="<i class='fas fa-spa fa-sm faIconStyle'></i> Orb Vallis" left class="text-center">
          <b-dropdown-item>
            <router-link to="/vallis/map">
              <i class="fas fa-map-marker-alt faIconStyle"></i>
              <span :style="navItemLabelStyle">Map</span>
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item>
            <router-link to="/vallis/fish" :style="navItemParent">
              <i class="fas fa-fish faIconStyle"></i>
              <span :style="navItemLabelStyle">Fishing Data</span>
            </router-link>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="<i class='fas fa-code faIconStyle'></i> Projects" left>
          <b-dropdown-item href="https://drops.warframestat.us" target="_blank">Drops</b-dropdown-item>
          <b-dropdown-item href="https://genesis.warframestat.us" target="_blank">Genesis</b-dropdown-item>
          <b-dropdown-item href="https://docs.warframestat.us" target="_blank">API Docs</b-dropdown-item>
          <b-dropdown-item href="https://warframestat.us" target="_blank">Status</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item right href="https://discord.gg/jGZxH9f" target="_blank"><i class="fab fa-discord faIconStyle"></i> Discord</b-nav-item>
        <b-nav-item right v-b-modal.about-modal><i class="fas fa-info faIconStyle"></i> About</b-nav-item>
        <b-nav-item right v-b-modal.settings-modal><i class="fas fa-cog faIconStyle"></i> Settings</b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<style>
  .faIconStyle {
    margin-top: 3px;
    margin-left: 10px;
    margin-right: 5px;
  }
</style>

<script>
  export default {
    name: 'Navbar',
    data() {
      return {
        faIconStyle: {
          color: 'white',
          'margin-top': '3px',
          'margin-left': '10px',
          'margin-right': '10px',
        },
        navItemParent: {
          display: 'flex',
          'justify-content': 'space-between',
          padding: '10px 0',
          'text-align': 'center',
        },
        navItemLabelStyle: {
          'flex-grow': 1,
        },
      };
    },
  };
</script>

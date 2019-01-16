<template>
  <b-navbar toggleable="md" type="dark" variant="primary" fixed="top">
    <b-navbar-brand href="/">Warframe Hub</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item><router-link to="/" exact><i class="fas fa-clock faIconStyle"></i> Timers</router-link></b-nav-item>

        <b-nav-item-dropdown text="<i class='fas fa-mountain fa-sm faIconStyle'></i> Plains" left class="text-center">
          <DropdownItem :isLocal="true" icon="fas fa-map-marker-alt" target="/poe/map" label="Map" />
          <DropdownItem :isLocal="true" icon="fas fa-fish" target="/poe/fish" label="Fishing Data" />
          <DropdownItem :isLocal="true" icon="fas fa-info" target="/poe/fish/howto" label="How to Fish" />
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="<i class='fas fa-spa fa-sm faIconStyle'></i> Orb Vallis" left class="text-center">
          <DropdownItem :isLocal="true" icon="fas fa-map-marker-alt" target="/vallis/map" label="Map" />
          <DropdownItem :isLocal="true" icon="fas fa-fish" target="/vallis/fish" label="Fishing Data" />
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="<i class='fas fa-code faIconStyle'></i> Projects" left>
          <DropdownItem icon="fas fa-download" target="https://drops.warframestat.us" label="Drops" />
          <DropdownItem icon="fas fa-robot" target="https://genesis.warframestat.us" label="Genesis" />
          <DropdownItem icon="fas fa-terminal" target="https://docs.warframestat.us" label="API Docs" />
          <DropdownItem icon="fas fa-tachometer-alt" target="https://warframestat.us" label="Status" />
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

<script>
  import DropdownItem from '@/components/DropdownNavItem.vue';

  export default {
    name: 'Navbar',
    components: {
      DropdownItem
    },
    data() {
      return {
        navItemParent: {
          display: 'flex',
          'justify-content': 'space-between',
          padding: '10px 0',
          'text-align': 'center',
        },
      };
    },
  };
</script>

<template>
  <b-navbar toggleable="md" type="dark" variant="primary" fixed="top" class="vw-100">
    <b-navbar-brand href="/">Warframe Hub</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item
          ><router-link to="/" exact><i class="fas fa-clock faIcon"></i> Timers</router-link></b-nav-item
        >

        <b-nav-item-dropdown left>
          <template slot="button-content"
            ><i class="fas fa-globe faIcon"></i> Open World</template
          >
          <b-dd-header><i class="fas fa-mountain faIcon"></i> Plains</b-dd-header>
          <DropdownItem :isLocal="true" icon="fas fa-map-marker-alt" target="/poe/map" label="Map" />
          <DropdownItem :isLocal="true" icon="fas fa-fish" target="/poe/fish" label="Fishing Data" />
          <DropdownItem :isLocal="true" icon="fas fa-info" target="/poe/fish/howto" label="How to Fish" />
          <b-dd-divider />
          <b-dd-header><i class="fas fa-icicles faIcon"></i> Orb Vallis</b-dd-header>
          <DropdownItem :isLocal="true" icon="fas fa-map-marker-alt" target="/vallis/map" label="Map" />
          <DropdownItem :isLocal="true" icon="fas fa-fish" target="/vallis/fish" label="Fishing Data" />
          <DropdownItem :isLocal="true" icon="fas fa-info" target="/vallis/fish/howto" label="How to Fish" />
        </b-nav-item-dropdown>
        <b-nav-item-dropdown left>
          <template slot="button-content"
            ><i class="fas fa-tools faIcon"></i> Extras</template
          >
          <DropdownItem :isLocal="true" icon="fas fa-database" target="/riven/data" label="Riven Data (Alpha)" />
          <DropdownItem :isLocal="true" icon="fas fa-camera" target="/synthesis" label="Synthesis Target" />
        </b-nav-item-dropdown>

        <b-nav-item-dropdown left>
          <template slot="button-content"
            ><i class="fas fa-terminal faIcon"></i> Projects</template
          >
          <DropdownItem icon="fas fa-download" target="https://drops.warframestat.us" label="Drops" />
          <DropdownItem icon="fas fa-robot" target="https://genesis.warframestat.us" label="Genesis" />
          <DropdownItem icon="fas fa-terminal" target="https://docs.warframestat.us" label="API Docs" />
          <DropdownItem icon="fas fa-tachometer-alt" target="https://warframestat.us" label="Status" />
          <DropdownItem icon="fas fa-scroll" target="https://old-hub.warframestat.us" label="Old Hub" />
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item right href="https://discord.gg/jGZxH9f" target="_blank" v-b-tooltip.bottom title="Discord"
          ><i class="fab fa-discord faIcon"></i
        ></b-nav-item>
        <b-nav-item right v-b-modal.about-modal v-b-tooltip.bottom title="Information"
          ><i class="fas fa-info faIcon"></i
        ></b-nav-item>
        <b-nav-item right v-b-modal.settings-modal v-b-tooltip.bottom title="Settings"
          ><i class="fas fa-cog faIcon"></i
        ></b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import DropdownItem from '@/components/DropdownNavItem.vue';

export default {
  name: 'Navbar',
  components: {
    DropdownItem,
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

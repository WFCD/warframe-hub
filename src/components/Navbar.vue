<template>
  <b-navbar toggleable="md" type="dark" variant="primary" fixed="top" class="vw-100">
    <b-navbar-brand href="/">Warframe Hub</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item
          ><router-link to="/" exact
            ><i class="fas fa-clock faIcon"></i> {{ $t('nav.timers') }}</router-link
          ></b-nav-item
        >

        <b-nav-item-dropdown left>
          <template slot="button-content"
            ><i class="fas fa-globe faIcon"></i> {{ $t('nav.ow') }}</template
          >
          <b-dd-header><i class="fas fa-mountain faIcon"></i> {{ $t('nav.owearth') }}</b-dd-header>
          <DropdownItem :isLocal="true" icon="fas fa-map-marker-alt" target="/poe/map" :label="$t('nav.map')" />
          <DropdownItem :isLocal="true" icon="fas fa-fish" target="/poe/fish" :label="$t('nav.fish')" />
          <DropdownItem :isLocal="true" icon="fas fa-info" target="/poe/fish/howto" :label="$t('nav.howto')" />
          <b-dd-divider />
          <b-dd-header><i class="fas fa-icicles faIcon"></i> {{ $t('nav.owvenus') }}</b-dd-header>
          <DropdownItem :isLocal="true" icon="fas fa-map-marker-alt" target="/vallis/map" :label="$t('nav.map')" />
          <DropdownItem :isLocal="true" icon="fas fa-fish" target="/vallis/fish" :label="$t('nav.fish')" />
          <DropdownItem :isLocal="true" icon="fas fa-info" target="/vallis/fish/howto" :label="$t('nav.howto')" />
        </b-nav-item-dropdown>
        <b-nav-item-dropdown left>
          <template slot="button-content"
            ><i class="fas fa-tools faIcon"></i> Extras</template
          >
          <DropdownItem :isLocal="true" icon="fas fa-database" target="/riven/data" :label="$t('nav.riven')" />
          <DropdownItem :isLocal="true" icon="fas fa-camera" target="/synthesis" :label="$t('nav.synth')" />
        </b-nav-item-dropdown>

        <b-nav-item-dropdown left>
          <template slot="button-content"
            ><i class="fas fa-terminal faIcon"></i> Projects</template
          >
          <DropdownItem icon="fas fa-download" target="https://drops.warframestat.us" :label="$t('nav.drops')" />
          <DropdownItem icon="fas fa-robot" target="https://genesis.warframestat.us" :label="$t('nav.genesis')" />
          <DropdownItem icon="fas fa-terminal" target="https://docs.warframestat.us" :label="$t('nav.docs')" />
          <DropdownItem icon="fas fa-tachometer-alt" target="https://warframestat.us" :label="$t('nav.status')" />
          <DropdownItem icon="fas fa-scroll" target="https://old-hub.warframestat.us" :label="$t('nav.old')" />
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item
          right
          href="https://discord.gg/jGZxH9f"
          target="_blank"
          v-b-tooltip.bottom
          :title="$t('nav.discord')"
          ><i class="fab fa-discord faIcon"></i
        ></b-nav-item>
        <b-nav-item right v-b-modal.about-modal v-b-tooltip.bottom :title="$t('nav.info')"
          ><i class="fas fa-info faIcon"></i
        ></b-nav-item>
        <b-nav-item right v-b-modal.settings-modal v-b-tooltip.bottom :title="$t('nav.settings')"
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

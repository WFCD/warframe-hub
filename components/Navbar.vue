<template>
  <b-navbar toggleable="md" type="dark" variant="primary" fixed="top" class="vw-100">
    <b-navbar-brand href="/">
      <img src="~/static/icon.png" alt="Warframe Hub" height="45px" />
      Warframe Hub
    </b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse id="nav_collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <nuxt-link to="/"> <i class="fas fa-clock faIcon" /> {{ $t('nav.timers') }} </nuxt-link>
        </b-nav-item>
        <b-nav-item-dropdown left>
          <template slot="button-content"><i class="fas fa-globe faIcon"></i> {{ $t('nav.ow') }}</template>
          <DropdownItem :is-local="true" icon="fas fa-info" target="/ow/fish/howto" :label="$t('nav.howto')" />
          <b-dd-divider />
          <b-dd-header><i class="fas fa-mountain faIcon"></i> {{ $t('nav.owearth') }}</b-dd-header>
          <DropdownItem :is-local="true" icon="fas fa-map-marker-alt" target="/poe/map" :label="$t('nav.map')" />
          <DropdownItem :is-local="true" icon="fas fa-fish" target="/poe/fish" :label="$t('nav.fish')" />
          <b-dd-divider />
          <b-dd-header><i class="fas fa-icicles faIcon"></i> {{ $t('nav.owvenus') }}</b-dd-header>
          <DropdownItem :is-local="true" icon="fas fa-map-marker-alt" target="/vallis/map" :label="$t('nav.map')" />
          <DropdownItem :is-local="true" icon="fas fa-fish" target="/vallis/fish" :label="$t('nav.fish')" />
          <b-dd-divider />
          <b-dd-header><i class="fas fa-biohazard faIcon"></i> {{ $t('nav.owdeimos') }}</b-dd-header>
          <DropdownItem :is-local="true" icon="fas fa-map-marker-alt" target="/deimos/map" :label="$t('nav.map')" />
          <DropdownItem :is-local="true" icon="fas fa-fish" target="/deimos/fish" :label="$t('nav.fish')" />
        </b-nav-item-dropdown>
        <b-nav-item-dropdown left>
          <template slot="button-content"><i class="fas fa-tools faIcon"></i> {{ $t('nav.extras') }}</template>
          <DropdownItem :is-local="true" icon="fas fa-database" target="/riven/data" :label="$t('nav.riven')" />
          <DropdownItem :is-local="true" icon="fas fa-camera" target="/synthesis" :label="$t('nav.synth')" />
        </b-nav-item-dropdown>

        <b-nav-item-dropdown left>
          <template slot="button-content"><i class="fas fa-terminal faIcon"></i> {{ $t('nav.projects') }}</template>
          <DropdownItem icon="fas fa-download" target="https://drops.warframestat.us" :label="$t('nav.drops')" />
          <DropdownItem icon="fas fa-robot" target="https://genesis.warframestat.us" :label="$t('nav.genesis')" />
          <DropdownItem icon="fas fa-terminal" target="https://docs.warframestat.us" :label="$t('nav.docs')" />
          <DropdownItem icon="fas fa-tachometer-alt" target="https://warframestat.us" :label="$t('nav.status')" />
          <DropdownItem icon="fas fa-scroll" target="https://old-hub.warframestat.us" :label="$t('nav.old')" />
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <DropdownItem
          icon="fab fa-discord"
          target="https://discord.gg/jGZxH9f"
          :label-if-mobile="true"
          :label="$t('nav.discord')"
        />
        <DropdownItem v-b-modal.about-modal icon="fas fa-info" :label-if-mobile="true" :label="$t('nav.info')" />
        <DropdownItem v-b-modal.settings-modal icon="fas fa-cog" :label-if-mobile="true" :label="$t('nav.settings')" />
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import DropdownItem from '@/components/DropdownNavItem.jsx';

export default {
  name: 'NavbarComponent',
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

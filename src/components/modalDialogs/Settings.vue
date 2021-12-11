<template>
  <b-modal @shown="checkNotifications" id="settings-modal" class="settings-modal" centered size="xl" title="Settings">
    <b-tabs card vertical>
      <b-tab title="Platform">
        <Platforms />
      </b-tab>
      <b-tab title="Language">
        <Languages />
      </b-tab>
      <b-tab title="Components">
        <b-form-group label="Components">
          <b-form-checkbox-group
            id="components-checks"
            :options="componentStates"
            v-model="activeComponents"
            v-on:input="updateComponentState"
            switches
            stacked
            class="settings-group"
          >
          </b-form-checkbox-group>
        </b-form-group>
      </b-tab>
      <b-tab title="Theme">
        <b-form-group label="Theme">
          <b-form-radio-group
            id="theme-radios"
            stacked
            v-model="theme"
            name="theme radios"
            v-on:change="updateTheme"
            class="settings-group themeTabWrapper"
          >
            <b-form-radio v-for="theme in getThemes" :key="theme.key" :value="theme.key">
              <i :class="theme.faclass" :style="themeIconStyle"></i>
              <span :style="themeLabelStyle">{{ theme.display }}</span>
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-tab>
      <b-tab title="Notifications">
        <NotifFilters />
      </b-tab>
      <b-tab title="Fissure Filters">
        <FissureFilters />
      </b-tab>
      <b-tab title="Sound Filters">
        <SoundFilters />
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
import NotifFilters from '@/components/modalDialogs/NotificationFilters.vue';
import FissureFilters from '@/components/modalDialogs/FissureFilters.vue';
import SoundFilters from '@/components/modalDialogs/SoundFilters.vue';
import Platforms from '@/components/modalDialogs/Platforms.vue';
import Languages from '@/components/modalDialogs/Languages.vue';

import themes from '@/assets/json/themes.json';
import baseComponents from '@/assets/json/components.json';
import { mapGetters } from 'vuex';

export default {
  name: 'SettingsModal',
  components: {
    NotifFilters,
    FissureFilters,
    SoundFilters,
    Platforms,
    Languages,
  },
  data() {
    return {
      themeIconStyle: {
        color: 'white',
        'margin-top': '3px',
        'padding-right': '10px',
      },
      themeLabelStyle: {
        'flex-grow': 1,
      },
      themes: themes,
    };
  },
  methods: {
    updateComponentState(enabledComponents) {
      Object.keys(this.rawCS).forEach((component) => {
        this.$store.commit('worldstate/commitComponentDisplayMode', [component, enabledComponents.includes(component)]);
      });
    },
    updateTheme(key) {
      this.$store.commit('worldstate/setTheme', [key]);
    },
    async checkNotifications() {
      return this.$store.dispatch('worldstate/checkNotifPermissions');
    },
  },
  computed: {
    ...mapGetters('worldstate', {
      rawCS: 'componentState',
      theme: 'theme',
    }),
    activeComponents: {
      get: function () {
        return Object.keys(this.rawCS)
          .map((component) => this.rawCS[component])
          .filter(
            (component) =>
              component.display && (!baseComponents[component.key] || baseComponents[component.key].displayable)
          )
          .map((component) => component.key);
      },
      set: function () {},
    },
    componentStates() {
      return Object.keys(this.rawCS)
        .map((component) => {
          if (!baseComponents[component] || !baseComponents[component].displayable) {
            return false;
          }
          return {
            text: this.rawCS[component].displayName,
            value: this.rawCS[component].key,
          };
        })
        .filter((c) => c);
    },
    getThemes() {
      return this.themes;
    },
  },
};
</script>

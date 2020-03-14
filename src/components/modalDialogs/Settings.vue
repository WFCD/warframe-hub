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
            name="Components"
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
      theme: this.$store.getters.theme,
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
      Object.keys(this.$store.getters.componentState).forEach((component) => {
        this.$store.commit('commitComponentDisplayMode', [component, enabledComponents.includes(component)]);
      });
    },
    updateTheme(key) {
      this.$store.commit('setTheme', [key]);
    },
    async checkNotifications() {
      return this.$store.dispatch('checkNotifPermissions');
    },
  },
  computed: {
    activeComponents: {
      get: function() {
        const components = Object.keys(this.$store.getters.componentState).map(
          (component) => this.$store.getters.componentState[component]
        );
        return components.filter((component) => component.display).map((component) => component.key);
      },
      set: function() {},
    },
    componentStates() {
      const cs = this.$store.getters.componentState;
      return Object.keys(cs).map((component) => {
        return {
          text: this.$store.getters.componentState[component].displayName,
          value: this.$store.getters.componentState[component].key,
        };
      });
    },
    getComponents() {
      return this.$store.getters.componentState;
    },
    getThemes() {
      return this.themes;
    },
  },
};
</script>

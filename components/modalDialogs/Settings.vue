<template>
  <b-modal id="settings-modal" class="settings-modal" centered size="xl" title="Settings" @shown="checkNotifications">
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
            v-model="activeComponents"
            :options="componentStates"
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
            v-model="theme"
            stacked
            name="theme radios"
            class="settings-group themeTabWrapper"
          >
            <b-form-radio v-for="t in themes" :key="t.key" :value="t.key">
              <i :class="t.faclass" :style="themeIconStyle"></i>
              <span :style="themeLabelStyle">{{ t.display }}</span>
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
import { mapGetters } from 'vuex';
import NotifFilters from '@/components/modalDialogs/NotificationFilters.vue';
import FissureFilters from '@/components/modalDialogs/FissureFilters.vue';
import SoundFilters from '@/components/modalDialogs/SoundFilters.vue';
import Platforms from '@/components/modalDialogs/Platforms.vue';
import Languages from '@/components/modalDialogs/Languages.vue';

import themes from '@/static/json/themes.json';
import baseComponents from '@/static/json/components.json';

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
      themes,
    };
  },
  computed: {
    ...mapGetters('worldstate', {
      rawCS: 'componentState',
      rawTheme: 'theme',
    }),
    theme: {
      get() {
        return this.rawTheme;
      },
      set(theme) {
        this.$store.commit('worldstate/setTheme', [theme]);
      },
    },
    activeComponents: {
      get() {
        return Object.keys(this.rawCS)
          .map((component) => this.rawCS[component])
          .filter(
            (component) =>
              component.display && (!baseComponents[component.key] || baseComponents[component.key].displayable)
          )
          .map((component) => component.key);
      },
      set(enabledComponents) {
        Object.keys(this.rawCS).forEach((component) => {
          this.$store.commit('worldstate/commitComponentDisplayMode', [
            component,
            enabledComponents.includes(component),
          ]);
        });
      },
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
  },
  methods: {
    checkNotifications() {
      return this.$store.dispatch('worldstate/checkNotifPermissions');
    },
  },
};
</script>

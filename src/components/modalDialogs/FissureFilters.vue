<template>
  <div id="fissureTabBody">
    Checking the checkbox next to a planet below will disable it from being shown in the fissures list.
    <div class="tab-wrap fit-height pt-3">
      <b-form-group label="Fissure Filters">
        <b-form-checkbox-group
          id="fissure-checks"
          name="Fissure Filters"
          :options="fissureStates"
          v-model="activeFissures"
          v-on:input="(vals) => updateFissureStates(vals)"
          switches
          stacked
          class="settings-group fissure-setting-group"
        >
        </b-form-checkbox-group>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FissureFilters',
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters('worldstate', {
      fissureStates: 'fissurePlanetStates',
    }),
    activeFissures: {
      get: function () {
        const planets = Object.keys(this.fissureStates).map((planet) => this.fissureStates[planet]);

        return planets.filter((planet) => planet.state).map((planet) => planet.value);
      },
      set: function () {},
    },
  },
  methods: {
    updateFissureStates(enabledFissures) {
      Object.keys(this.fissureStates).forEach((planet) => {
        this.$store.commit('worldstate/commitFissurePlanetState', [planet, enabledFissures.includes(planet)]);
      });
    },
  },
};
</script>

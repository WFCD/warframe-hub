<template>
  <div id="fissureTabBody">
    Checking the checkbox next to a planet below will disable it from being shown in the fissures list.
    <div class="tab-wrap">
      <b-form-group label="Fissure Filters">
        <b-form-checkbox-group
          id="fissure-checks"
          name="Fissure Filters"
          :options="fissureStates"
          v-model="activeFissures"
          v-on:input="(vals) => updateFissureStates(vals)"
          switches
          stacked
          class="settings-group"
        >
        </b-form-checkbox-group>
      </b-form-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FissureFilters',
  components: {},
  data() {
    return {};
  },
  computed: {
    activeFissures: {
      get: function() {
        const planets = Object.keys(this.$store.getters.fissurePlanetStates).map(
          (planet) => this.$store.getters.fissurePlanetStates[planet]
        );

        return planets.filter((planet) => planet.state).map((planet) => planet.value);
      },
      set: function() {},
    },
    fissureStates() {
      return this.$store.getters.fissurePlanetStates;
    },
  },
  methods: {
    updateFissureStates(enabledFissures) {
      Object.keys(this.$store.getters.fissurePlanetStates).forEach((planet) => {
        this.$store.commit('commitFissurePlanetState', [planet, enabledFissures.includes(planet)]);
      });
    },
  },
};
</script>

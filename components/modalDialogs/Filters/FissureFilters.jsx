import { mapGetters } from 'vuex';

export default {
  name: 'FissureFilters',
  data() {
    return {};
  },
  computed: {
    ...mapGetters('worldstate', {
      fissureStates: 'fissurePlanetStates',
    }),
    activeFissures: {
      get() {
        const planets = Object.keys(this.fissureStates).map((planet) => this.fissureStates[planet]);

        return planets.filter((planet) => planet.state).map((planet) => planet.value);
      },
      set(enabledFissures) {
        Object.keys(this.fissureStates).forEach((planet) => {
          if (this.fissureStates[planet] !== enabledFissures.includes(planet)) {
            this.$store.commit('worldstate/commitFissurePlanetState', [planet, enabledFissures.includes(planet)]);
          }
        });
      },
    },
  },
  render() {
    return (
      <b-tab title="Fissure Filters">
        <div id="fissureTabBody">
          Checking the checkbox next to a planet below will disable it from being shown in the fissures list.
          <div class="tab-wrap fit-height pt-3">
            <b-form-group label="Fissure Filters">
              <b-form-checkbox-group
                id="fissure-checks"
                v-model={this.activeFissures}
                name="Fissure Filters"
                options={this.fissureStates}
                switches
                stacked
                class="settings-group fissure-setting-group"
              ></b-form-checkbox-group>
            </b-form-group>
          </div>
        </div>
      </b-tab>
    );
  },
};

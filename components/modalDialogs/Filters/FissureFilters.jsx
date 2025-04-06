import { useWorldstateStore } from '~/store/worldstate';

export default {
  name: 'FissureFilters',
  computed: {
    activeFissures: {
      get() {
        const planets = Object.keys(useWorldstateStore().fissurePlanetStates).map(
          (planet) => useWorldstateStore().fissurePlanetStates[planet]
        );

        return planets.filter((planet) => planet.state).map((planet) => planet.value);
      },
      set(enabledFissures) {
        Object.keys(useWorldstateStore().fissurePlanetStates).forEach((planet) => {
          if (useWorldstateStore().fissurePlanetStates[planet] !== enabledFissures.includes(planet)) {
            useWorldstateStore().commitFissurePlanetState([planet, enabledFissures.includes(planet)]);
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
                options={useWorldstateStore().fissurePlanetStates}
                switches
                stacked
                class={'settings-group fissure-setting-group'}
              ></b-form-checkbox-group>
            </b-form-group>
          </div>
        </div>
      </b-tab>
    );
  },
};

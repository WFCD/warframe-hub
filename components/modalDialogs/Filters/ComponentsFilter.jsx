import { mapGetters } from 'vuex';
import baseComponents from '@/static/json/components.json';

export default {
  computed: {
    ...mapGetters('worldstate', {
      rawCS: 'componentState',
    }),
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
  render() {
    return (
      <b-tab title="Components">
        <b-form-group label="Components">
          <b-form-checkbox-group
            id="components-checks"
            v-model={this.activeComponents}
            options={this.componentStates}
            switches
            stacked
            class="settings-group"
          ></b-form-checkbox-group>
        </b-form-group>
      </b-tab>
    );
  },
};

import baseComponents from '@/static/json/components.json';
import { useWorldstateStore } from '~/store/worldstate';

export default {
  computed: {
    componentState() {
      return useWorldstateStore().componentState;
    },
    activeComponents: {
      get() {
        return Object.values(useWorldstateStore().componentState)
          .filter(
            (component) =>
              component.display && (!baseComponents[component.key] || baseComponents[component.key].displayable)
          )
          .map((component) => component.key);
      },
      set(enabledComponents) {
        Object.keys(useWorldstateStore().componentState).forEach((component) => {
          if (useWorldstateStore().componentState[component].display !== enabledComponents.includes(component)) {
            return useWorldstateStore().commitComponentDisplayMode([component, enabledComponents.includes(component)]);
          }
        });
      },
    },
    componentStates() {
      return Object.keys(useWorldstateStore().componentState)
        .map((component) => {
          if (!baseComponents[component] || !baseComponents[component].displayable) {
            return false;
          }
          return {
            text: useWorldstateStore().componentState[component].displayName,
            value: useWorldstateStore().componentState[component].key,
          };
        })
        .filter((c) => c)
        .sort((a, b) => a.text.localeCompare(b.text));
    },
  },
  render() {
    return (
      <b-tab title="Components">
        <b-form-group label="Components">
          <b-form-checkbox-group
            id="components-checks"
            v-model={this.activeComponents}
            options={useWorldstateStore().componentState}
            switches
            stacked
            class="settings-group"
          ></b-form-checkbox-group>
        </b-form-group>
      </b-tab>
    );
  },
};

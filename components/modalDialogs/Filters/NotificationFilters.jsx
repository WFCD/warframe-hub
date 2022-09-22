import Multiselect from 'vue-multiselect';
import { mapGetters } from 'vuex';

import '../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'NotificationFilters',
  computed: {
    ...mapGetters('worldstate', ['trackableState']),
    activeRewards: {
      get() {
        return Object.keys(this.trackableState.rewardTypes)
          .map((component) => this.trackableState.rewardTypes[component])
          .filter((component) => component.state);
      },
      set() {},
    },
    rewardStates() {
      return Object.keys(this.trackableState.rewardTypes).map((reward) => this.trackableState.rewardTypes[reward]);
    },
    activeEvents: {
      get() {
        return Object.keys(this.trackableState.eventTypes)
          .filter((k) => !k.includes('fissures') && !k.includes('arbitration'))
          .map((component) => this.trackableState.eventTypes[component])
          .filter((component) => component.state);
      },
      set() {},
    },
    activeFissures: {
      get() {
        return Object.keys(this.trackableState.eventTypes)
          .filter((k) => k.includes('fissures'))
          .map((component) => this.trackableState.eventTypes[component])
          .filter((component) => component.state);
      },
      set() {},
    },
    activeArbis: {
      get() {
        return Object.keys(this.trackableState.eventTypes)
          .filter((k) => k.includes('arbitration'))
          .map((component) => this.trackableState.eventTypes[component])
          .filter((component) => component.state);
      },
      set() {},
    },
    eventStates() {
      return Object.keys(this.trackableState.eventTypes)
        .filter((k) => !k.includes('fissures') && !k.includes('arbitration'))
        .map((k) => this.trackableState.eventTypes[k]);
    },
    fissureStates() {
      return Object.keys(this.trackableState.eventTypes)
        .filter((k) => k.includes('fissures'))
        .map((k) => this.trackableState.eventTypes[k]);
    },
    arbiStates() {
      return Object.keys(this.trackableState.eventTypes)
        .filter((k) => k.includes('arbitration'))
        .map((k) => this.trackableState.eventTypes[k]);
    },
  },
  methods: {
    toggleRewardState({ value, state }) {
      this.$store.commit('worldstate/commitRewardState', [value, !state]);
    },
    updateRewardStates(enabledRewards) {
      Object.keys(this.trackableState.rewardTypes).forEach((reward) => {
        this.$store.commit('worldstate/commitRewardState', [reward, enabledRewards.includes(reward)]);
      });
    },
    toggleEventState({ value, state }) {
      this.$store.commit('worldstate/commitEventState', [value, !state]);
    },
    updateEventStates(enabledEvents) {
      Object.keys(this.trackableState.eventTypes).forEach((event) => {
        this.$store.commit('worldstate/commitEventState', [event, enabledEvents.includes(event)]);
      });
    },
  },
  render() {
    return (
      <b-tab title="Notifications">
        <div id="notificationsTabBody">
          Add the tags for entries you want notifications for.
          <br />
          You can search and use "Enter" to select, as well as "Backspace" to remove the last in the list.
          <Multiselect
            value={this.activeRewards}
            options={this.rewardStates}
            placeholder="Select Rewards"
            label="text"
            track-by="text"
            close-on-select={false}
            clear-on-select={false}
            preserve-search={true}
            hide-selected={true}
            multiple={true}
            onSelect={this.toggleRewardState}
            onRemove={this.toggleRewardState}
          />
          <hr />
          <Multiselect
            value={this.activeEvents}
            options={this.eventStates}
            placeholder="Select Events"
            label="text"
            track-by="text"
            close-on-select={false}
            clear-on-select={false}
            preserve-search={true}
            hide-selected={true}
            multiple={true}
            onSelect={this.toggleEventState}
            onRemove={this.toggleEventState}
          />
          <hr />
          <Multiselect
            value={this.activeFissures}
            options={this.fissureStates}
            placeholder="Select Fissures"
            label="text"
            track-by="text"
            close-on-select={false}
            clear-on-select={false}
            preserve-search={true}
            hide-selected={true}
            multiple={true}
            onSelect={this.toggleEventState}
            onRemove={this.toggleEventState}
          />
          <hr />
          <Multiselect
            value={this.activeArbis}
            options={this.arbiStates}
            placeholder="Select Arbitrations"
            label="text"
            track-by="text"
            close-on-select={false}
            clear-on-select={false}
            preserve-search={true}
            hide-selected={true}
            multiple={true}
            onSelect={this.toggleEventState}
            onRemove={this.toggleEventState}
          />
        </div>
      </b-tab>
    );
  },
};

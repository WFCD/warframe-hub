<template>
  <div id="notificationsTabBody">
    Add the tags for entries you want notifications for.
    <br />
    You can search and use "Enter" to select, as well as "Backspace" to remove the last in the list.
    <Multiselect
      :value="activeRewards"
      :options="this.rewardStates"
      placeholder="Select Rewards"
      label="text"
      track-by="text"
      @select="this.toggleRewardState"
      @remove="this.toggleRewardState"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      :hide-selected="true"
      :multiple="true"
    />
    <hr />
    <Multiselect
      :value="activeEvents"
      :options="this.eventStates"
      placeholder="Select Events"
      label="text"
      track-by="text"
      @select="this.toggleEventState"
      @remove="this.toggleEventState"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      :hide-selected="true"
      :multiple="true"
    />
    <hr />
    <Multiselect
      :value="activeFissures"
      :options="this.fissureStates"
      placeholder="Select Fissures"
      label="text"
      track-by="text"
      @select="this.toggleEventState"
      @remove="this.toggleEventState"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      :hide-selected="true"
      :multiple="true"
    />
    <hr />
    <Multiselect
      :value="activeArbis"
      :options="this.arbiStates"
      placeholder="Select Arbitrations"
      label="text"
      track-by="text"
      @select="this.toggleEventState"
      @remove="this.toggleEventState"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      :hide-selected="true"
      :multiple="true"
    />
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import Multiselect from 'vue-multiselect';

export default {
  name: 'NotificationFilters',
  components: {
    Multiselect,
  },
  computed: {
    activeRewards: {
      get: function () {
        return Object.keys(this.$store.getters.trackableState.rewardTypes)
          .map((component) => this.$store.getters.trackableState.rewardTypes[component])
          .filter((component) => component.state);
      },
      set: function () {},
    },
    rewardStates() {
      return Object.keys(this.$store.getters.trackableState.rewardTypes).map(
        (reward) => this.$store.getters.trackableState.rewardTypes[reward]
      );
    },
    activeEvents: {
      get: function () {
        return Object.keys(this.$store.getters.trackableState.eventTypes)
          .filter((k) => !k.includes('fissures') && !k.includes('arbitration'))
          .map((component) => this.$store.getters.trackableState.eventTypes[component])
          .filter((component) => component.state);
      },
      set: function () {},
    },
    activeFissures: {
      get: function () {
        return Object.keys(this.$store.getters.trackableState.eventTypes)
          .filter((k) => k.includes('fissures'))
          .map((component) => this.$store.getters.trackableState.eventTypes[component])
          .filter((component) => component.state);
      },
      set: function () {},
    },
    activeArbis: {
      get: function () {
        return Object.keys(this.$store.getters.trackableState.eventTypes)
          .filter((k) => k.includes('arbitration'))
          .map((component) => this.$store.getters.trackableState.eventTypes[component])
          .filter((component) => component.state);
      },
      set: function () {},
    },
    eventStates() {
      return Object.keys(this.$store.getters.trackableState.eventTypes)
        .filter((k) => !k.includes('fissures') && !k.includes('arbitration'))
        .map((k) => this.$store.getters.trackableState.eventTypes[k]);
    },
    fissureStates() {
      return Object.keys(this.$store.getters.trackableState.eventTypes)
        .filter((k) => k.includes('fissures'))
        .map((k) => this.$store.getters.trackableState.eventTypes[k]);
    },
    arbiStates() {
      return Object.keys(this.$store.getters.trackableState.eventTypes)
        .filter((k) => k.includes('arbitration'))
        .map((k) => this.$store.getters.trackableState.eventTypes[k]);
    },
  },
  methods: {
    toggleRewardState({ value, state }) {
      this.$store.commit('commitRewardState', [value, !state]);
    },
    updateRewardStates(enabledRewards) {
      Object.keys(this.$store.getters.trackableState.rewardTypes).forEach((reward) => {
        this.$store.commit('commitRewardState', [reward, enabledRewards.includes(reward)]);
      });
    },
    toggleEventState({ value, state }) {
      this.$store.commit('commitEventState', [value, !state]);
    },
    updateEventStates(enabledEvents) {
      Object.keys(this.$store.getters.trackableState.eventTypes).forEach((event) => {
        this.$store.commit('commitEventState', [event, enabledEvents.includes(event)]);
      });
    },
  },
};
</script>

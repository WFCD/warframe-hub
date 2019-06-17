<template>
  <div id="notificationsTabBody">
    Check the checkbock for entries you want notifications for:
    <div class="tab-wrap">
      <b-form-group label="Reward Filters">
        <b-form-checkbox-group
          id="reward-checks"
          name="Reward Filters"
          :options="rewardStates"
          v-model="activeRewards"
          v-on:input="(vals) => updateRewardStates(vals)"
          switches
          stacked
          class="settings-group"
        >
        </b-form-checkbox-group>
      </b-form-group>
    </div>
    <hr />
    <div class="tab-wrap">
      <b-form-group label="Event Filters">
        <b-form-checkbox-group
          id="event-checks"
          name="Event Filters"
          :options="eventStates"
          v-model="activeEvents"
          v-on:input="(vals) => updateEventStates(vals)"
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
  name: 'NotificationFilters',
  components: {},
  data() {
    return {};
  },
  computed: {
    activeRewards: {
      get: function() {
        const components = Object.keys(this.$store.getters.trackableState.rewardTypes).map(
          (component) => this.$store.getters.trackableState.rewardTypes[component]
        );

        return components.filter((component) => component.state).map((component) => component.value);
      },
      set: function() {},
    },
    rewardStates() {
      return this.$store.getters.trackableState.rewardTypes;
    },
    activeEvents: {
      get: function() {
        const components = Object.keys(this.$store.getters.trackableState.eventTypes).map(
          (component) => this.$store.getters.trackableState.eventTypes[component]
        );

        return components.filter((component) => component.state).map((component) => component.value);
      },
      set: function() {},
    },
    eventStates() {
      return this.$store.getters.trackableState.eventTypes;
    },
  },
  methods: {
    updateRewardStates(enabledRewards) {
      Object.keys(this.$store.getters.trackableState.rewardTypes).forEach((reward) => {
        this.$store.commit('commitRewardState', [reward, enabledRewards.includes(reward)]);
      });
    },
    updateEventStates(enabledEvents) {
      Object.keys(this.$store.getters.trackableState.eventTypes).forEach((event) => {
        this.$store.commit('commitEventState', [event, enabledEvents.includes(event)]);
      });
    },
  },
};
</script>

<template>
  <div class="timers">
    <b-container fluid>
      <AlertPanel v-if="this.$store.getters.componentState.alerts.state" :alerts="this.$store.getters.worldstate.alerts"/>
    </b-container>
  </div>
</template>

<script>
import AlertPanel from '@/components/panels/AlertPanel.vue';

export default {
  name: 'timers',
  components: {
    AlertPanel
  }
};
</script>

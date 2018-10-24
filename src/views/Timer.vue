<template>
  <div class="timers">
    <b-container fluid>
      <AlertPanel v-if="this.$store.getters.componentState.alerts.state"/>
    </b-container>
  </div>
</template>

<script>
import AlertPanel from '@/components/panels/AlertPanel.vue'

export default {
  name: 'timers',
  components: {
    AlertPanel
  }
}
</script>

<template>
  <div class="timers">
    <b-container fluid>
      <b-row>
        <AlertPanel v-if="this.$store.getters.componentState.alerts.state" :alerts="this.$store.getters.worldstate.alerts"/>
        <TimePanel :time="this.$store.getters.worldstate.earthCycle"  :location="'Earth'" v-if="this.$store.getters.componentState.earth.state"/>
        <TimePanel :time="this.$store.getters.worldstate.cetusCycle"  :location="'Cetus'" v-if="this.$store.getters.componentState.cetus.state"/>
        <NewsPanel :news="this.$store.getters.worldstate.news"  v-if="this.$store.getters.componentState.news.state"/>
        <ResetPanel />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AlertPanel from '@/components/panels/AlertPanel.vue'
import TimePanel from '@/components/panels/TimePanel.vue'
import NewsPanel from '@/components/panels/NewsPanel.vue'
import ResetPanel from '@/components/panels/ResetPanel.vue'

export default {
  name: 'timers',
  components: {
    AlertPanel,
    TimePanel,
    NewsPanel,
    ResetPanel
  }
}
</script>

<template>
  <div class="timers">
    <b-container fluid>
      <b-row>
        <AlertPanel v-if="this.$store.getters.componentState.alerts.state"/>
        <TimePanel  v-if="this.$store.getters.componentState.earth.state" :time="this.$store.getters.worldstate.earthCycle"  :location="'Earth'" />
        <TimePanel  v-if="this.$store.getters.componentState.cetus.state" :time="this.$store.getters.worldstate.cetusCycle"  :location="'Cetus'" />
        <NewsPanel  v-if="this.$store.getters.componentState.news.state" :news="this.$store.getters.worldstate.news" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AlertPanel from '@/components/panels/AlertPanel.vue';
import NewsPanel from '@/components/panels/NewsPanel.vue';
import TimePanel from '@/components/panels/TimePanel.vue';

export default {
  name: 'timers',
  components: {
    AlertPanel,
    NewsPanel,
    TimePanel
  }
};
</script>

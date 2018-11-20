<template>
  <div class="timers">
    <b-container fluid>
      <b-row>
        <AlertPanel v-if="this.$store.getters.componentState.alerts.state" :alerts="this.$store.getters.worldstate.alerts"/>
        <NewsPanel v-if="this.$store.getters.componentState.news.state" :news="this.$store.getters.worldstate.news" />
        <TimePanel v-if="this.$store.getters.componentState.earth.state" :time="this.$store.getters.worldstate.earthCycle" location="Earth" />
        <TimePanel v-if="this.$store.getters.componentState.cetus.state" :time="this.$store.getters.worldstate.cetusCycle" location="Cetus" />
        <TimePanel v-if="this.$store.getters.componentState.vallis.state" :time="this.$store.getters.worldstate.vallisCycle" location="Vallis" />
        <ResetPanel />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AlertPanel from '@/components/panels/AlertPanel.vue';
import NewsPanel from '@/components/panels/NewsPanel.vue';
import TimePanel from '@/components/panels/TimePanel.vue';
import ResetPanel from '@/components/panels/ResetPanel.vue';

export default {
  name: 'timers',
  components: {
    AlertPanel,
    NewsPanel,
    TimePanel,
    ResetPanel
  },
  methods: {
    track () {
      this.$ga.page('/');
    }
  }
};
</script>

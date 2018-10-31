<template>
  <div class="timers">
    <b-container fluid>
      <AlertPanel v-if="this.$store.getters.componentState.alerts.state"/>
      <NewsPanel  v-if="this.$store.getters.componentState.news.state" :news="this.$store.getters.worldstate.news" />
    </b-container>
  </div>
</template>

<script>
import AlertPanel from '@/components/panels/AlertPanel.vue';
import NewsPanel from '@/components/panels/NewsPanel.vue';

export default {
  name: 'timers',
  components: {
    AlertPanel,
    NewsPanel
  }
};
</script>

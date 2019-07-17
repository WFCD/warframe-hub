<template>
  <div class="timers">
    <b-container fluid class="grid">
      <b-row ref="timerComponentGrid" v-packery="{ itemSelector: '.packery-item', percentPosition: true }">
        <AcolytesPanel v-if="componentState.acolytes.display" :acolytes="worldstate.persistentEnemies" />
        <EventsPanel v-if="componentState.event.display" :events="worldstate.events" />
        <ResetPanel v-if="componentState.reset.display" />
        <AlertPanel v-if="componentState.alerts.display" :alerts="worldstate.alerts" />
        <InvasionsPanel v-if="componentState.invasions.display" :invasions="worldstate.invasions" />
        <NewsPanel v-if="componentState.news.display" :news="worldstate.news" />
        <NightwavePanel v-if="componentState.nightwave.display" :nightwave="worldstate.nightwave" />
        <TimePanel v-if="componentState.earth.display" :time="worldstate.earthCycle" location="Earth" />
        <TimePanel v-if="componentState.cetus.display" :time="worldstate.cetusCycle" location="Cetus" />
        <TimePanel v-if="componentState.vallis.display" :time="worldstate.vallisCycle" location="Vallis" />
        <SortiePanel v-if="componentState.sortie.display" :sortie="worldstate.sortie" />
        <BountyPanel v-if="componentState.bounties.display" :syndicate="ostron" type="Ostron" />
        <BountyPanel v-if="componentState['solaris-bounties'].display" :syndicate="solaris" type="Solaris United" />
        <FissuresPanel v-if="componentState.fissures.display" :fissures="worldstate.fissures" />
        <DarvoDealsPanel v-if="componentState.darvo.display" :deals="worldstate.dailyDeals" />
        <SalesPanel v-if="componentState.deals.display" :sales="worldstate.flashSales" />
        <VoidTraderPanel v-if="componentState.baro.display" :voidTrader="worldstate.voidTrader" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AlertPanel from '@/components/panels/AlertPanel.vue';
import NewsPanel from '@/components/panels/NewsPanel.vue';
import TimePanel from '@/components/panels/TimePanel.vue';
import ResetPanel from '@/components/panels/ResetPanel.vue';
import SortiePanel from '@/components/panels/SortiePanel.vue';
import AcolytesPanel from '@/components/panels/AcolytesPanel.vue';
import FissuresPanel from '@/components/panels/FissuresPanel.vue';
import BountyPanel from '@/components/panels/BountyPanel.vue';
import InvasionsPanel from '@/components/panels/InvasionsPanel.vue';
import EventsPanel from '@/components/panels/EventsPanel.vue';
import DarvoDealsPanel from '@/components/panels/DarvoDealsPanel.vue';
import SalesPanel from '@/components/panels/SalesPanel.vue';
import VoidTraderPanel from '@/components/panels/VoidTraderPanel.vue';
import NightwavePanel from '@/components/panels/NightwavePanel.vue';

export default {
  name: 'timers',
  components: {
    AlertPanel,
    NewsPanel,
    TimePanel,
    ResetPanel,
    SortiePanel,
    AcolytesPanel,
    FissuresPanel,
    BountyPanel,
    InvasionsPanel,
    EventsPanel,
    DarvoDealsPanel,
    SalesPanel,
    VoidTraderPanel,
    NightwavePanel,
  },
  data() {
    return {
      components: {},
      breakpoint: 'md',
      cols: 2,
      breakpoints: { lg: 1800, md: 1200, sm: 996, xs: 768, xxs: 480 },
      colsAll: { lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 },
      isDraggable: true,
      isResizable: true,
      lastUpdate: 0,
    };
  },
  mounted() {
    this.components = this.gridState.components;
    this.lastUpdate = Date.now();
  },
  methods: {
    track() {
      this.$ga.page('/');
    },
  },
  watch: {
    worldstate: {
      handler: function() {
        if (this.$refs.panelObserver) {
          this.$refs.panelObserver.forEach((element) => {
            element.toggleAttribute('updating');
            element.toggleAttribute('updating');
          });
          this.$refs.layout.resizeAllItems(2, 'vertical');
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      componentState: 'components',
      gridState: 'grid',
    }),
    ...mapGetters({
      worldstate: 'worldstate',
      ostron: 'ostronSyndicate',
      solaris: 'solarisSyndicate',
    }),
  },
};
</script>
<style>
/* Saved for testing purposes */
/*
.grid-item {
  border: 1px dotted #000;
  background-color: rgb(146, 146, 146);
}
*/
</style>

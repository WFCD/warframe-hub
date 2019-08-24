<template>
  <div class="timers">
    <b-container fluid class="grid">
      <b-row ref="timerComponentGrid" v-packery="{ itemSelector: '.packery-item', percentPosition: true }">
        <acolytes v-if="componentState.acolytes.display" :acolytes="worldstate.persistentEnemies" />
        <events v-if="componentState.event.display" :events="worldstate.events" />
        <reset v-if="componentState.reset.display" />
        <alerts v-if="componentState.alerts.display" :alerts="worldstate.alerts" />
        <invasions v-if="componentState.invasions.display" :invasions="worldstate.invasions" />
        <news v-if="componentState.news.display" :news="worldstate.news" />
        <nightwave v-if="componentState.nightwave.display" :nightwave="worldstate.nightwave" />
        <timer v-if="componentState.earth.display" :time="worldstate.earthCycle" location="Earth" />
        <timer v-if="componentState.cetus.display" :time="worldstate.cetusCycle" location="Cetus" />
        <timer v-if="componentState.vallis.display" :time="worldstate.vallisCycle" location="Vallis" />
        <sortie v-if="componentState.sortie.display" :sortie="worldstate.sortie" />
        <bounty v-if="componentState.bounties.display" :syndicate="ostron" type="Ostron" />
        <bounty v-if="componentState['solaris-bounties'].display" :syndicate="solaris" type="Solaris United" />
        <fissures v-if="componentState.fissures.display" :fissures="worldstate.fissures" />
        <deals v-if="componentState.darvo.display" :deals="worldstate.dailyDeals" />
        <sales v-if="componentState.deals.display" :sales="worldstate.flashSales" />
        <void-trader v-if="componentState.baro.display" :voidTrader="worldstate.voidTrader" />
        <construction v-if="componentState.construction.display" :construction="worldstate.constructionProgress" />
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
import ConstructionPanel from '@/components/panels/ConstructionPanel.vue';

export default {
  name: 'timers',
  components: {
    alerts: AlertPanel,
    news: NewsPanel,
    timer: TimePanel,
    reset: ResetPanel,
    sortie: SortiePanel,
    acolytes: AcolytesPanel,
    fissures: FissuresPanel,
    bounty: BountyPanel,
    invasions: InvasionsPanel,
    events: EventsPanel,
    deals: DarvoDealsPanel,
    sales: SalesPanel,
    'void-trader': VoidTraderPanel,
    nightwave: NightwavePanel,
    construction: ConstructionPanel,
  },
  data() {
    return {
      components: {},
    };
  },
  methods: {
    track() {
      this.$ga.page('/');
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

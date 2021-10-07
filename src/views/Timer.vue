<template>
  <div class="timers">
    <b-container fluid class="grid">
      <vue-binpacker>
        <!--
        <timer
          v-if="componentState.earth.display"
          :time="(worldstate && worldstate.earthCycle) || null"
          location="Earth"
        />
        <timer
          v-if="componentState.cetus.display"
          :time="(worldstate && worldstate.cetusCycle) || null"
          location="Cetus"
        />
        <timer
          v-if="componentState.vallis.display"
          :time="(worldstate && worldstate.vallisCycle) || null"
          location="Vallis"
        />
        <timer
          v-if="componentState.cambion.display"
          :time="(worldstate && worldstate.cambionCycle) || null"
          location="Cambion"
        />
        <timer
          v-if="componentState['steel-path'].display"
          :time="worldstate.steelPath"
          :display="steelPath"
          headerPath="steelPath.header"
        />
        <arbitration v-if="componentState.arbitration.display" :arbitration="worldstate.arbitration" />
        <sentientOutposts
          v-if="componentState.sentientoutposts.display"
          :sentientOutposts="worldstate.sentientOutposts"
        />
        <reset v-if="componentState.reset.display" />
        -->
        <aggregatedtimer v-if="componentState.aggregated.display" :worldstate="worldstate" />
        <construction v-if="componentState.construction.display" :construction="worldstate.constructionProgress" />
        <deals v-if="componentState.darvo.display" :deals="worldstate.dailyDeals" />
        <news v-if="componentState.news.display" :news="worldstate.news" />
        <events
          v-if="componentState.event.display && worldstate.events && worldstate.events.length"
          :events="worldstate.events"
        />
        <alerts v-if="componentState.alerts.display" :alerts="worldstate.alerts" />
        <invasions v-if="componentState.invasions.display" :invasions="worldstate.invasions" />
        <nightwave v-if="componentState.nightwave.display" :nightwave="worldstate.nightwave" />
        <conclave v-if="componentState.conclave.display" :conclave="worldstate.conclaveChallenges" />
        <sortie v-if="componentState.sortie.display" :sortie="worldstate.sortie" />
        <fissures v-if="componentState.fissures.display" :fissures="worldstate.fissures" />
        <bounty v-if="componentState.bounties.display" :syndicate="ostron" type="ostron" />
        <bounty v-if="componentState['solaris-bounties'].display" :syndicate="solaris" type="solaris" />
        <bounty v-if="componentState['entrati-bounties'].display" :syndicate="entrati" type="entrati" />
        <sales v-if="componentState.deals.display" :sales="worldstate.flashSales" />
        <void-trader v-if="componentState.baro.display" :voidTrader="worldstate.voidTrader" />
      </vue-binpacker>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AlertPanel from '@/components/panels/AlertPanel.vue';
import NewsPanel from '@/components/panels/NewsPanel.vue';
import AggregatedTimePanel from '@/components/panels/AggregatedTimePanel';
import SortiePanel from '@/components/panels/SortiePanel.vue';
import FissuresPanel from '@/components/panels/FissuresPanel.vue';
import BountyPanel from '@/components/panels/BountyPanel.vue';
import InvasionsPanel from '@/components/panels/InvasionsPanel.vue';
import EventsPanel from '@/components/panels/EventsPanel.vue';
import DarvoDealsPanel from '@/components/panels/DarvoDealsPanel.vue';
import SalesPanel from '@/components/panels/SalesPanel.vue';
import VoidTraderPanel from '@/components/panels/VoidTraderPanel.vue';
import NightwavePanel from '@/components/panels/NightwavePanel.vue';
import ConstructionPanel from '@/components/panels/ConstructionPanel.vue';
import ConclavePanel from '@/components/panels/ConclavePanel.vue';

// import SentientOutpostsPanel from '@/components/panels/SentientOutpostsPanel.vue';
// import ArbitrationPanel from '@/components/panels/ArbitrationPanel.vue';
// import TimePanel from '@/components/panels/TimePanel.vue';

export default {
  name: 'timers-view',
  components: {
    alerts: AlertPanel,
    news: NewsPanel,
    aggregatedtimer: AggregatedTimePanel,
    sortie: SortiePanel,
    fissures: FissuresPanel,
    bounty: BountyPanel,
    invasions: InvasionsPanel,
    events: EventsPanel,
    deals: DarvoDealsPanel,
    sales: SalesPanel,
    'void-trader': VoidTraderPanel,
    nightwave: NightwavePanel,
    construction: ConstructionPanel,
    conclave: ConclavePanel,
    // sentientOutposts: SentientOutpostsPanel,
    // reset: ResetPanel,
    // arbitration: ArbitrationPanel,
    // timer: TimePanel,
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
      componentState: (state) => state.worldstate.components,
    }),
    ...mapGetters('worldstate', {
      worldstate: 'worldstate',
      ostron: 'ostronSyndicate',
      solaris: 'solarisSyndicate',
      entrati: 'entratiSyndicate',
    }),
    steelPath: function () {
      return this.worldstate.steelPath && this.worldstate.steelPath.currentReward
        ? `${this.worldstate.steelPath.currentReward.name}: ${this.worldstate.steelPath.currentReward.cost}`
        : 'See Teshin: ???';
    },
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

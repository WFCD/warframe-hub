<template>
  <div class="timers">
    <b-container fluid class="grid">
      <vue-binpacker>
        <aggregatedtimer v-if="displayAggregate" :worldstate="worldstate" />
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
        <void-trader v-if="componentState.baro.display" :void-trader="worldstate.voidTrader" />
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
import InvasionsPanel from '@/components/panels/InvasionsPanel.jsx';
import EventsPanel from '@/components/panels/EventsPanel.vue';
import DarvoDealsPanel from '@/components/panels/DarvoDealsPanel.vue';
import SalesPanel from '@/components/panels/SalesPanel.vue';
import VoidTraderPanel from '@/components/panels/VoidTraderPanel.vue';
import NightwavePanel from '@/components/panels/NightwavePanel.vue';
import ConstructionPanel from '@/components/panels/ConstructionPanel.vue';
import ConclavePanel from '@/components/panels/ConclavePanel.vue';

export default {
  name: 'TimersView',
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
  },
  data() {
    return {
      components: {},
    };
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
    displayAggregate() {
      return (
        this.componentState.aggregated.display &&
        (this.componentState.earth.display ||
          this.componentState.cetus.display ||
          this.componentState.vallis.display ||
          this.componentState.cambion.display ||
          this.componentState.reset.display ||
          this.componentState.sentientoutposts.display ||
          this.componentState['steel-path'].display ||
          this.componentState.arbitration.display)
      );
    },
    steelPath() {
      return this.worldstate.steelPath && this.worldstate.steelPath.currentReward
        ? `${this.worldstate.steelPath.currentReward.name}: ${this.worldstate.steelPath.currentReward.cost}`
        : 'See Teshin: ???';
    },
  },
  methods: {
    track() {
      this.$ga.page('/');
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

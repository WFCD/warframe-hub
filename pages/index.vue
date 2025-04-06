<template>
  <div class="timers">
    <b-container fluid class="grid">
      <vue-binpacker>
        <aggregatedtimer v-if="displayAggregate" :worldstate="worldstate" />
        <construction
          v-if="useWorldstateStore().worldstate.components.construction.display"
          :construction="worldstate.constructionProgress"
        />
        <deals v-if="useWorldstateStore().worldstate.components.darvo.display" :deals="worldstate.dailyDeals" />
        <news v-if="useWorldstateStore().worldstate.components.news.display" :news="worldstate.news" />
        <events
          v-if="
            useWorldstateStore().worldstate.components.event.display && worldstate.events && worldstate.events.length
          "
          :events="worldstate.events"
        />
        <alerts v-if="useWorldstateStore().worldstate.components.alerts.display" :alerts="worldstate.alerts" />
        <invasions
          v-if="useWorldstateStore().worldstate.components.invasions.display"
          :invasions="worldstate.invasions"
        />
        <nightwave
          v-if="useWorldstateStore().worldstate.components.nightwave.display"
          :nightwave="worldstate.nightwave"
        />
        <conclave
          v-if="useWorldstateStore().worldstate.components.conclave.display"
          :conclave="worldstate.conclaveChallenges"
        />
        <sortie v-if="useWorldstateStore().worldstate.components.sortie.display" :sortie="worldstate.sortie" />
        <sortie v-if="useWorldstateStore().worldstate.components.archonHunt.display" :sortie="worldstate.archonHunt" />
        <fissures v-if="useWorldstateStore().worldstate.components.fissures.display" :fissures="worldstate.fissures" />
        <bounty
          v-if="useWorldstateStore().worldstate.components.bounties.display"
          :syndicate="useWorldstateStore().ostron"
          type="ostron"
        />
        <bounty
          v-if="useWorldstateStore().worldstate.components['solaris-bounties'].display"
          :syndicate="useWorldstateStore().solaris"
          type="solaris"
        />
        <bounty
          v-if="useWorldstateStore().worldstate.components['entrati-bounties'].display"
          :syndicate="useWorldstateStore().entrati"
          type="entrati"
        />
        <sales v-if="useWorldstateStore().worldstate.components.deals.display" :sales="worldstate.flashSales" />
        <void-trader
          v-if="useWorldstateStore().worldstate.components.baro.display"
          :void-trader="worldstate.voidTrader"
        />
      </vue-binpacker>
    </b-container>
  </div>
</template>

<script>
import { useWorldstateStore } from '~/store/worldstate';
import AlertPanel from '@/components/panels/AlertPanel.jsx';
import NewsPanel from '@/components/panels/NewsPanel.vue';
import AggregatedTimePanel from '@/components/panels/AggregatedTimePanel.jsx';
import SortiePanel from '@/components/panels/SortiePanel.jsx';
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
      useWorldstateStore,
    };
  },
  computed: {
    displayAggregate() {
      return (
        useWorldstateStore().worldstate.components.aggregated.display &&
        (useWorldstateStore().worldstate.components.cetus.display ||
          useWorldstateStore().worldstate.components.vallis.display ||
          useWorldstateStore().worldstate.components.cambion.display ||
          useWorldstateStore().worldstate.components.reset.display ||
          useWorldstateStore().worldstate.components.sentientoutposts.display ||
          useWorldstateStore().worldstate.components['steel-path'].display ||
          useWorldstateStore().worldstate.components.arbitration.display)
      );
    },
    steelPath() {
      return useWorldstateStore().worldstate.steelPath && useWorldstateStore().worldstate.steelPath.currentReward
        ? `${useWorldstateStore().worldstate.steelPath.currentReward.name}: ${useWorldstateStore().worldstate.steelPath.currentReward.cost}`
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

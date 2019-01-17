<template>
  <div class="timers">
    <b-container fluid class="grid">
      <grid-layout
            :layout="getActiveComponents"
            :col-num="12"
            :row-height="100"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
      >
        <grid-item v-for="panel in getActiveComponents"
             :x="panel.x"
             :y="panel.y"
             :w="panel.w"
             :h="panel.h"
             :i="panel.i"
             :key="panel.i">
          <div :is="panelDetails[panel.i].component" v-bind="panelDetails[panel.i].props"></div>
        </grid-item>
      </grid-layout>
        <!--<EventsPanel v-if="this.$store.getters.componentState.event.state" :events="this.$store.getters.worldstate.events" />
        <ResetPanel v-if="this.$store.getters.componentState.reset.state" />
        <AlertPanel v-if="this.$store.getters.componentState.alerts.state" :alerts="this.$store.getters.worldstate.alerts"/>
        <InvasionsPanel v-if="this.$store.getters.componentState.invasions.state" :invasions="this.$store.getters.worldstate.invasions"/>
        <NewsPanel v-if="this.$store.getters.componentState.news.state" :news="this.$store.getters.worldstate.news" />
        <TimePanel v-if="this.$store.getters.componentState.earth.state" :time="this.$store.getters.worldstate.earthCycle" location="Earth" />
        <TimePanel v-if="this.$store.getters.componentState.cetus.state" :time="this.$store.getters.worldstate.cetusCycle" location="Cetus" />
        <TimePanel v-if="this.$store.getters.componentState.vallis.state" :time="this.$store.getters.worldstate.vallisCycle" location="Vallis" />
        <SortiePanel v-if="this.$store.getters.componentState.sortie.state" :sortie="this.$store.getters.worldstate.sortie"/>
        <BountyPanel v-if="this.$store.getters.componentState.bounties.state" :syndicate="this.ostrons" type="Ostron" />
        <BountyPanel v-if="this.$store.getters.componentState['solaris-bounties'].state" :syndicate="this.solaris" type="Solaris United" />
        <FissuresPanel v-if="this.$store.getters.componentState.fissures.state" :fissures="this.$store.getters.worldstate.fissures"/>
        <DarvoDealsPanel v-if="this.$store.getters.componentState.darvo.state" :deals="this.$store.getters.worldstate.dailyDeals" />
        <SalesPanel v-if="this.$store.getters.componentState.deals.state" :sales="this.$store.getters.worldstate.flashSales" />
        <VoidTraderPanel v-if="this.$store.getters.componentState.baro.state" :voidTrader="this.$store.getters.worldstate.voidTrader" />-->
    </b-container>
  </div>
</template>

<script>
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
import VueGridLayout from 'vue-grid-layout';
import HubPanelWrap from '@/components/HubPanelWrap';

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
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    HubPanelWrap
  },
  data() {
    return {};
  },
  methods: {
    track () {
      this.$ga.page('/');
    },
  },
  computed: {
    ostrons: function() {
      const filtered = this.$store.getters.worldstate.syndicateMissions
        .filter((syndicate) => syndicate.syndicate === 'Ostrons');
      return filtered[0];
    },
    solaris: function() {
      const filtered = this.$store.getters.worldstate.syndicateMissions
        .filter((syndicate) => syndicate.syndicate === 'Solaris United');
      return filtered[0];
    },
    getActiveComponents: function() {
      const activeComponents = this.$store.getters.componentState.grid_layout
        .filter((panel) => this.$store.getters.componentState[panel.i].state);
      return activeComponents;
    },
    panelDetails: function() {
      return {
        alerts: {
          component: AlertPanel,
          props: { alerts: this.$store.getters.worldstate.alerts }
        },
        acolytes: {
          component: AcolytesPanel,
          props: { acolytes: this.$store.getters.worldstate.persistentEnemies }
        }
      };
    }
  }
};
</script>

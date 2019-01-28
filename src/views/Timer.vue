<template>
  <div class="timers">
    <b-container fluid class="grid">
      <grid-layout
        :layouts="layout"
        :cols="12"
        :rowHeight="1"
        :margin="[10, 10]"
      >
      <template slot-scope="props">
        <grid-item
          v-for="panel in props.layout"
          v-if="panel.state"
          :x="panel.x"
          :y="panel.y"
          :w="panel.w"
          :h="panel.h"
          :i="panel.i"
          :key="panel.i"
          :is-draggable="true"
          :is-resizable="true"
          :containerWidth="props.containerWidth"
        >
          <div :is="panel.component" v-bind="panel.props"></div>
        </grid-item>
        </template>
      </grid-layout>
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
import VueResponsiveGridLayout from 'vue-responsive-grid-layout';
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
    GridLayout: VueResponsiveGridLayout.VueResponsiveGridLayout,
    GridItem: VueResponsiveGridLayout.VueGridItem,
    HubPanelWrap
  },
  data() {
    return {
      layout: null
    };
  },
  created: function() {
    const getters = this.$store.getters;
    this.layout = {
      'lg': [{
        ...getters.componentState.alerts.position,
        state: getters.componentState.alerts.state,
        component: AlertPanel,
        props: {
          alerts: getters.worldstate.alerts
        }
      },
      {
        ...getters.componentState.acolytes.position,
        state: getters.componentState.acolytes.state,
        component: AcolytesPanel,
        props: {
          acolytes: getters.worldstate.persistentEnemies
        }
      },
      {
        ...getters.componentState.event.position,
        state: getters.componentState.event.state,
        component: EventsPanel,
        props: { events: getters.worldstate.events }
      },
      {
        ...getters.componentState.news.position,
        state: getters.componentState.news.state,
        component: NewsPanel,
        props: { news: getters.worldstate.news }
      },
      {
        ...getters.componentState.earth.position,
        state: getters.componentState.earth.state,
        component: TimePanel,
        props: {
          time: getters.worldstate.earthCycle,
          location: 'Earth'
        }
      },
      {
        ...getters.componentState.cetus.position,
        state: getters.componentState.cetus.state,
        component: TimePanel,
        props: {
          time: getters.worldstate.cetusCycle,
          location: 'Cetus'
        }
      },
      {
        ...getters.componentState.vallis.position,
        state: getters.componentState.vallis.state,
        component: TimePanel,
        props: {
          time: getters.worldstate.vallisCycle,
          location: 'Vallis'
        }
      },
      {
        ...getters.componentState.sortie.position,
        state: getters.componentState.sortie.state,
        component: SortiePanel,
        props: { sortie: getters.worldstate.sortie }
      },
      {
        ...getters.componentState.bounties.position,
        state: getters.componentState.bounties.state,
        component: BountyPanel,
        props: {
          syndicate: this.ostrons,
          type: 'Ostron'
        }
      },
      {
        ...getters.componentState['solaris-bounties'].position,
        state: getters.componentState['solaris-bounties'].state,
        component: BountyPanel,
        props: {
          syndicate: this.solaris,
          type: 'Solaris United'
        }
      },
      {
        ...getters.componentState.fissures.position,
        state: getters.componentState.fissures.state,
        component: FissuresPanel,
        props: { fissures: getters.worldstate.fissures }
      },
      {
        ...getters.componentState.darvo.position,
        state: getters.componentState.darvo.state,
        component: DarvoDealsPanel,
        props: { deals: getters.worldstate.dailyDeals }
      },
      {
        ...getters.componentState.deals.position,
        state: getters.componentState.deals.state,
        component: SalesPanel,
        props: { sales: getters.worldstate.flashSales }
      },
      {
        ...getters.componentState.baro.position,
        state: getters.componentState.baro.state,
        component: VoidTraderPanel,
        props: { voidTrader: getters.worldstate.voidTrader }
      },
      {
        ...getters.componentState.invasions.position,
        state: getters.componentState.invasions.state,
        component: InvasionsPanel,
        props: { invasions: getters.worldstate.invasions }
      },
      {
        ...getters.componentState.reset.position,
        state: getters.componentState.reset.state,
        component: ResetPanel,
        props: {}
      }
      ]
    };
  },
  methods: {
    track() {
      this.$ga.page('/');
    },
    moved(i, newX, newY) {
      this.$store.commit('commitComponentPosition', [i, newX, newY]);
    },
    resized(i, newH, newW) {
      this.$store.commit('commitComponentResize', [i, newW, newH]);
    }
  },
  computed: {
    ostrons: function() {
      const filtered = this.$store.getters.worldstate.syndicateMissions.filter(
        (syndicate) => syndicate.syndicate === 'Ostrons'
      );
      return filtered[0];
    },
    solaris: function() {
      const filtered = this.$store.getters.worldstate.syndicateMissions.filter(
        (syndicate) => syndicate.syndicate === 'Solaris United'
      );
      return filtered[0];
    },
    getActiveComponents: function() {
      const activeComponents = this.layout.filter((panel) => panel.state);
      return activeComponents;
    }
  }
};
</script>

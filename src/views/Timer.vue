<template>
  <div class="timers">
    <b-container fluid class="grid">
      <grid-layout
        @layout-update="onLayoutUpdate"
        :layouts="layout"
        :cols="2"
        :rowHeight="10"
        :colsAll="cols"
      >
        <template slot-scope="props">
          <grid-item
            v-for="panel in props.layout"
            v-if="panel.state"
            :cols="props.cols"
            :containerWidth="props.containerWidth"
            :rowHeight="props.rowHeight"
            :maxRows="props.maxRows"
            :x="panel.x"
            :y="panel.y"
            :w="panel.w"
            :h="panel.h"
            :i="panel.i"
            :key="panel.i"
            :is-draggable="true"
            :is-resizable="true"
            :heightFromChildren="true"
          >
            <div :is="panel.component" v-bind="panel.props"></div>
          </grid-item>
        </template>
      </grid-layout>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapGetters } from "vuex";

import AlertPanel from "@/components/panels/AlertPanel.vue";
import NewsPanel from "@/components/panels/NewsPanel.vue";
import TimePanel from "@/components/panels/TimePanel.vue";
import ResetPanel from "@/components/panels/ResetPanel.vue";
import SortiePanel from "@/components/panels/SortiePanel.vue";
import AcolytesPanel from "@/components/panels/AcolytesPanel.vue";
import FissuresPanel from "@/components/panels/FissuresPanel.vue";
import BountyPanel from "@/components/panels/BountyPanel.vue";
import InvasionsPanel from "@/components/panels/InvasionsPanel.vue";
import EventsPanel from "@/components/panels/EventsPanel.vue";
import DarvoDealsPanel from "@/components/panels/DarvoDealsPanel.vue";
import SalesPanel from "@/components/panels/SalesPanel.vue";
import VoidTraderPanel from "@/components/panels/VoidTraderPanel.vue";
import VueResponsiveGridLayout from "vue-responsive-grid-layout";
import HubPanelWrap from "@/components/HubPanelWrap";

export default {
  name: "timers",
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
    return {};
  },
  methods: {
    track() {
      this.$ga.page("/");
    },
    onLayoutUpdate(layout, layouts, last) {
      last;
    },
    resized(i, newH, newW) {
      this.$store.commit("commitComponentResize", [i, newW, newH]);
    }
  },
  computed: {
    ...mapState({
      gridState: "grid",
      componentState: "components",
      worldstate: state => state.worldstates[state.platform]
    }),
    ostrons: function() {
      const filtered = this.worldstate.syndicateMissions.filter(
        syndicate => syndicate.syndicate === "Ostrons"
      );
      return filtered[0];
    },
    solaris: function() {
      const filtered = this.worldstate.syndicateMissions.filter(
        syndicate => syndicate.syndicate === "Solaris United"
      );
      return filtered[0];
    },
    getActiveComponents: function() {
      const activeComponents = this.layout.filter(panel => panel.state);
      return activeComponents;
    },
    cols: function() {
      return { lg: 2 };
    },
    componentInfo: function() {
      const resolve_props = (props, obj=this, object_identifier='@', separator='.') => {
        if (typeof(props) !== 'object' || Array.isArray(props)) throw "props should be an object.";
        return Object.entries(props).reduce((prev, [key, prop]) => {
          if (prop[0] === object_identifier) {
            var target_object = prop.slice(1).split(separator).reduce((prev, curr) => prev && prev[curr], obj);
            prev[key] = target_object;
          } else {
            prev[key] = prop;
          }
          return prev;
        }, {});
      }
      
      return {
        earth: {
          state: this.componentState.earth.state,
          component: this.componentState.earth.component,
          props: resolve_props(this.componentState.earth.props)
        }
      }
    },
    layout: function() {
      return this.gridState.layouts;


      // return {
      //   lg: [
      //     {
      //       state: this.componentState.earth.state,
      //       component: this.componentState.earth.component,
      //       props: resolve_props(this.componentState.earth.props),
      //       x: 1,
      //       y: 0,
      //       w: 1,
      //       h: 6,
      //       i: "earth"
      //     },
      //     {
      //       ...this.componentState.cetus.position,
      //       state: this.componentState.cetus.state,
      //       component: "TimePanel",
      //       props: {
      //         time: this.worldstate.cetusCycle,
      //         location: "Cetus"
      //       }
      //     },
      //     {
      //       ...this.componentState.vallis.position,
      //       state: this.componentState.vallis.state,
      //       component: "TimePanel",
      //       props: {
      //         time: this.worldstate.vallisCycle,
      //         location: "Vallis"
      //       }
      //     }
      //   ]
      // };
    }
  }
};
</script>

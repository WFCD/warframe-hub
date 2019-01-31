<template>
  <div class="timers">
    <b-container fluid class="grid">
      <vue-responsive-grid-layout 
        @layout-update='onLayoutUpdate'
        @layout-change='onLayoutChange'
        @layout-init='onLayoutInit'
        :layouts='layouts'
        :breakpoint='breakpoint'
        :breakpoints='breakpoints'
        :cols='cols'
        :colsAll="colsAll"
        :rowHeight='10'
      >
        <template slot-scope='props'>
          <vue-grid-item v-for='item in props.layout'
                  :i='item.i'
                  :key='item.i'
                  :w.sync='item.w'
                  :h.sync='item.h'
                  :x='item.x'
                  :y='item.y'
                  :container-width='props.containerWidth'
                  :row-height='props.rowHeight'
                  :class-name='"grid-item"'
                  :cols='props.cols'
                  :height-from-children='false'
                  :max-rows='props.maxRows'
                  :is-draggable='isDraggable'
                  :is-resizable='isResizable'
                  :heightFromChildren='true'
          >
              <HubPanelWrap :title="componentState[item.i].display">
                <div :is="componentState[item.i].component" v-bind="resolve_props(componentState[item.i].props)" />
              </HubPanelWrap>
          </vue-grid-item>
        </template>
      </vue-responsive-grid-layout>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

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
  name: "timers",
  components: {
    'vue-grid-item': VueResponsiveGridLayout.VueGridItem,
    'vue-responsive-grid-layout': VueResponsiveGridLayout.VueResponsiveGridLayout,
    'AlertPanel': AlertPanel,
    'NewsPanel': NewsPanel,
    'TimePanel': TimePanel,
    'ResetPanel': ResetPanel,
    'SortiePanel': SortiePanel,
    'AcolytesPanel': AcolytesPanel,
    'FissuresPanel': FissuresPanel,
    'BountyPanel': BountyPanel,
    'InvasionsPanel': InvasionsPanel,
    'EventsPanel': EventsPanel,
    'DarvoDealsPanel': DarvoDealsPanel,
    'SalesPanel': SalesPanel,
    'VoidTraderPanel': VoidTraderPanel,
    'HubPanelWrap': HubPanelWrap
  },
  data() {
    return {
      heightChanged: false,
      layouts: {},
      breakpoint: 'lg',
      cols: 2,
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      colsAll: { lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 },
      isDraggable: true,
      isResizable: true,
    };
  },
  mounted() {
    this.layouts = Object.assign({}, this.gridState.layouts);
  },
  methods: {
    track() {
      this.$ga.page("/");
    },
    onLayoutUpdate(layout, layouts) {
      const currentTime = Date.now();
      if (currentTime - this.lastUpdate > 500) {
        this.$store.commit('commitLayoutUpdate', [layouts]);
        this.lastUpdate = currentTime;
      }
      this.$set(this.layouts, this.breakpoint, layout);
    },

    onLayoutChange(layout, layouts, breakpoint) {
      this.$set(this.layouts, breakpoint, layout);
    },

    onLayoutInit(layout, layouts, cols, breakpoint) {
      this.cols = cols;
      this.breakpoint = breakpoint;
      this.$set(this.layouts, breakpoint, layout);
    },

    onBreakpointChange(breakpoint) {
      this.breakpoint = breakpoint;
    },

    onWidthChange(width, cols) {
        this.cols = cols;
    },
    // Replaces a string that starts with the object_identifier with the respective object.
    // Ex. '@worldstate.syndicateMissions' sets the object property to obj.worldstate.syndicateMissions
    resolve_props(props, obj=this, object_identifier='@', separator='.') {
      if (typeof(props) !== 'object' || Array.isArray(props)) throw 'props should be an object.';
      return Object.entries(props).reduce((prev, [key, value]) => {
        if (value[0] === object_identifier) {
          var target_object = value.slice(1).split(separator).reduce((prev, curr) => prev && prev[curr], obj);
          prev[key] = target_object;
        } else {
          prev[key] = value;
        }
        return prev;
      }, {});
    }
  },
  computed: {
    //Simplifies this.$state.grid to just this.gridState
    ...mapState({
      gridState: 'grid',
      componentState: 'components',
      worldstate: (state) => state.worldstates[state.platform]
    }),
    ostrons: function() {
      const filtered = this.worldstate.syndicateMissions.filter(
        (syndicate) => syndicate.syndicate === 'Ostrons'
      );
      return filtered[0];
    },
    solaris: function() {
      const filtered = this.worldstate.syndicateMissions.filter(
        (syndicate) => syndicate.syndicate === 'Solaris United'
      );
      return filtered[0];
    }
  }
};
</script>

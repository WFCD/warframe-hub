<template>
  <div class="timers">
    <b-container fluid class="grid">
      <vue-responsive-grid-layout
        @layout-update="onLayoutUpdate"
        @layout-change="onLayoutChange"
        @layout-init="onLayoutInit"
        @width-change="onWidthChange"
        @breakpoint-change="onBreakpointChange"
        :layouts="layouts"
        :compact-type="'vertical'"
        :breakpoint="breakpoint"
        :cols="cols"
        :colsAll="colsAll"
        :rowHeight="1"
        ref="layout"
      >
        <template slot-scope="props">
          <vue-grid-item
            v-for="item in props.layout"
            :i="item.i"
            :key="item.i"
            :w.sync="item.w"
            :h.sync="item.h"
            :x="item.x"
            :y="item.y"
            :container-width="props.containerWidth"
            :row-height="props.rowHeight"
            :is-draggable="true"
            :is-resizable="false"
            class-name="grid-item panel-header"
            :cols="props.cols"
            :height-from-children="true"
            :max-rows="props.maxRows"
            :canBeResizedWithAll="false"
            handle=".header-panel"
          >
            <div ref="panelObserver" :id="item.i">
              <div
                :is="componentState[item.i].component"
                v-bind="resolveProps(componentState[item.i].props)"
              />
            </div>
          </vue-grid-item>
        </template>
      </vue-responsive-grid-layout>
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
    VoidTraderPanel
  },
  data() {
    return {
      components: {},
      breakpoint: 'md',
      cols: 2,
      breakpoints: { lg: 2200, md: 1200, sm: 996, xs: 768, xxs: 480 },
      colsAll: { lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 },
      isDraggable: true,
      isResizable: true,
      lastUpdate: 0
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
    updateComponents(layout, breakpoint) {
      layout.forEach((itemSize) => {
        this.$set(this.components[itemSize.i], breakpoint, itemSize);
      });
      const currTime = Date.now();
      if (currTime - this.lastUpdate > 500) {
        this.$store.commit('commitGridLayout', [this.components]);
        this.lastUpdate = currTime;
      }
    },

    onLayoutUpdate(layout) {
      this.updateComponents(layout, this.breakpoint);
    },

    onLayoutChange(layout, layouts, breakpoint) {
      this.updateComponents(layout, breakpoint);
    },

    onLayoutInit(layout, layouts, cols, breakpoint) {
      this.cols = cols;
      this.breakpoint = breakpoint;
      this.updateComponents(layout, breakpoint);
    },

    onBreakpointChange(breakpoint) {
      this.breakpoint = breakpoint;
    },

    onWidthChange(width, cols) {
      this.cols = cols;
    },

    // Replaces a string that starts with the object_identifier with the respective object.
    // Ex. '@worldstate.syndicateMissions' sets the object property to obj.worldstate.syndicateMissions
    resolveProps(props, obj = this, objIdentifier = '@', separator = '.') {
      if (typeof props !== 'object' || Array.isArray(props)) {
        throw 'props should be an object.';
      }
      return Object.entries(props).reduce((prev, [key, value]) => {
        if (value[0] === objIdentifier) {
          var target = value
            .slice(1)
            .split(separator)
            .reduce((prev, curr) => prev && prev[curr], obj);
          prev[key] = target;
        } else {
          prev[key] = value;
        }
        return prev;
      }, {});
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
      deep: true
    }
  },
  computed: {
    ...mapState({
      componentState: 'components',
      gridState: 'grid'
    }),
    ...mapGetters({
      worldstate: 'worldstate',
      ostron: 'ostronSyndicate',
      solaris: 'solarisSyndicate'
    }),
    layouts: function() {
      return Object.entries(this.components)
        .filter(([key]) => {
          return this.componentState[key].state;
        })
        .reduce((acc, [, sizes]) => {
          Object.entries(sizes).forEach(([size, itemSize]) => {
            if (!acc[size]) {
              acc[size] = [];
            }
            acc[size].push(itemSize);
          });
          return acc;
        }, {});
    }
  }
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

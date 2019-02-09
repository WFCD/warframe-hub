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
          >
            <div ref="panelObserver" :id="item.i">
              <TimePanel
                :location="componentState[item.i].display"
                :time="worldstate[`${item.i}Cycle`]"
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
import TimePanel from '@/components/panels/TimePanel.vue';

export default {
  name: 'timers',
  components: {
    TimePanel
  },
  data() {
    return {
      components: {
        earth: {
          md: { x: 0, y: 0, w: 1, h: 181, i: 'earth' }
        },
        vallis: {
          md: { x: 0, y: 3, w: 1, h: 181, i: 'vallis' }
        },
        cetus: {
          md: { x: 1, y: 0, w: 1, h: 181, i: 'cetus' }
        }
      },
      breakpoint: 'md',
      cols: 2,
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      colsAll: { lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 },
      isDraggable: true,
      isResizable: true
    };
  },
  methods: {
    track() {
      this.$ga.page('/');
    },
    updateComponents(layout, breakpoint) {
      layout.forEach((itemSize) => {
        this.$set(this.components[itemSize.i], breakpoint, itemSize);
      });
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
    }
  },
  watch: {
    worldstate: {
      handler: function() {
        if (this.$refs.panelObserver) {
          this.$refs.panelObserver.forEach((element) => {
            element.toggleAttribute(
              'updating'
            );
            element.toggleAttribute(
              'updating'
            );
          });
          this.$refs.layout.resizeAllItems(2, 'vertical');
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      componentState: 'components'
    }),
    ...mapGetters({
      worldstate: 'worldstate'
    }),
    layouts: function() {
      return Object.entries(this.components)
        .filter(([key]) => this.componentState[key].state)
        .reduce((acc, [, sizes]) => {
          Object.entries(sizes).forEach(([size, itemSize]) => {
            if (!acc[size]) acc[size] = [];
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
.grid-item {
  border: 1px dotted #000;
  background-color: rgb(146, 146, 146);
}
</style>

<template>
  <div class="timers">
    <b-container fluid class="grid">
      <vue-responsive-grid-layout
        :style="{border: '1px solid #000'}"
        @layout-update="onLayoutUpdate"
        @layout-change="onLayoutChange"
        @layout-init="onLayoutInit"
        @width-change="onWidthChange"
        @breakpoint-change="onBreakpointChange"
        :layouts="layouts"
        :compact-type="'vertical'"
        :breakpoint="breakpoint"
        :cols="cols"
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
            :is-resizable="true"
            :class-name="'grid-item'"
            :cols="props.cols"
            :height-from-children="true"
            :max-rows="props.maxRows"
          >
            <div>Test{{item.i}}
              <br>
              <br>
              <br>
              <br>
            </div>
          </vue-grid-item>
        </template>
      </vue-responsive-grid-layout>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'timers',
  data() {
    return {
      layouts: {
        md: [
          { x: 0, y: 0, w: 2, h: 3, i: '1' },
          { x: 2, y: 0, w: 2, h: 3, i: '2' },
          { x: 4, y: 0, w: 2, h: 3, i: '3' },
          { x: 0, y: 3, w: 2, h: 3, i: '4' }
        ]
      },
      breakpoint: 'md',
      components: {
        '1': { i: '1', component: 'example-component', defaultSize: 2 },
        '2': { i: '2', component: 'example-component', defaultSize: 2 },
        '3': { i: '3', component: 'example-component', defaultSize: 2 },
        '4': { i: '4', component: 'example-component', defaultSize: 2 }
      },
      cols: 10,
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      colsAll: { lg: 10, md: 8, sm: 6, xs: 4, xxs: 2 },
      isDraggable: true,
      isResizable: true
    };
  },
  methods: {
    track() {
      this.$ga.page('/');
    },
    onLayoutUpdate(layout) {
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
    }
  }
};
</script>
<style>

.resizable-handle {
  position:absolute;
  width:20px;
  height:20px;
  bottom:0;
  right:0px;
  text-align:right;
}
.resizable-handle::after {
  content: "";
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 5px;
  height: 5px;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
}
.vue-grid-draggable-container {
  width: 100%;
  height: 100%;
}
.grid-item {
  border: 1px dotted #000;
  background-color: rgb(146, 146, 146);
}
.vue-grid-placeholder {
  background: #ddd; border: 2px dashed #aaa;
}

.vue-grid-layout {
  width: 100%;
  display:block;
  position:relative;
  height: 100%;
}
</style>

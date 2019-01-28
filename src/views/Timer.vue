<template>
  <div id='wrapper' style='align-items: stretch;width: 100%; height: 100%;'>
    <div style='position:relative;width:100%;height:100%;'>
      <div style='height: 30px;'>
        <div class='pull-right'>
          <div @click='switchLayout()' class='btn btn-md'><span class='glyphicon glyphicon-share-alt'></span></div>
          <div @click='gridMode()' class='btn btn-md'><span class='glyphicon glyphicon-th-large'></span></div>
          <div @click='listMode()' class='btn btn-md'><span class='glyphicon glyphicon-list'></span></div>
        </div>
      </div>
      <vue-responsive-grid-layout 
        :style='{border: "1px solid #000"}'
        @layout-update='onLayoutUpdate'
        @layout-change='onLayoutChange'
        @layout-init='onLayoutInit'
        :layouts='layouts'
        :breakpoint='breakpoint'
        :cols='cols'
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
                  :is-draggable='true'
                  :is-resizable='true'
                  handle='h2'
                  :heightFromChildren='true'
          >
              <div><h2>Test{{item.i}}</h2><span>rawr</span></div>
          </vue-grid-item>
        </template>
      </vue-responsive-grid-layout>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
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
    'vue-grid-item': VueResponsiveGridLayout.VueGridItem,
    'vue-responsive-grid-layout': VueResponsiveGridLayout.VueResponsiveGridLayout
  },
  data() {
    return {
      layouts: {
        'md': [
          {"w":2,"h":3,"x":0,"y":0,"i":"1"},
          {"w":2,"h":3,"x":2,"y":0,"i":"2"},
          {"w":2,"h":3,"x":4,"y":0,"i":"3"},
          {"w":2,"h":3,"x":0,"y":3,"i":"4"},
          {"w":2,"h":3,"x":0,"y":6,"i":"5"},
          {"w":2,"h":3,"x":2,"y":6,"i":"6"},
          {"w":2,"h":3,"x":4,"y":6,"i":"7"},
          {"w":2,"h":3,"x":4,"y":3,"i":"8"},
          {"w":2,"h":3,"x":2,"y":3,"i":"9"}
        ]
      },
      breakpoint: 'md',
      components: {
        '1': { i: '1', component: 'example-component', defaultSize: 2},
        '2': { i: '2', component: 'example-component', defaultSize: 2},
        '3': { i: '3', component: 'example-component', defaultSize: 2},
        '4': { i: '4', component: 'example-component', defaultSize: 2},
      },
      cols: 10,
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      colsAll: { lg: 10, md: 8, sm: 6, xs: 4, xxs: 2 },
      isDraggable: true,
      isResizable: true,
    };
  },
  methods: {
        onLayoutUpdate(layout, layouts) {
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
        gridMode() {
            this.$refs.layout.resizeAllItems(2, 'vertical');
        },
        listMode() {
            this.$refs.layout.resizeAllItems(this.cols, 'horizontal');
        },
    },
};
</script>
<style>
#app {
  background: #fff;
  border-radius: 4px;
  transition: all 0.2s;
}

html {
  height: 100%;
}

body {
  height: 100%;
}

#content {
  padding: 0px 20px;
  min-height: 100vh;
  transition: all 0.3s;
  width: 100%;
}

.resizable-handle {
  position:absolute;
  width:20px;
  height:20px;
  bottom:0;
  right:0px;
  text-align:right;
}
.resizable-handle::after {
  content: '';
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

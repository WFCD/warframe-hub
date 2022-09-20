<template>
  <HubPanelWrap :title="headertext" class="construction">
    <b-list-group>
      <b-list-group-item
        v-if="construction && Object.keys(construction).length > 2"
        class="list-group-item-borderbottom"
      >
        <div class="construction-wrapper text-center">
          <VueEllipseProgress
            :progress="fomoProgress"
            color="#ff0000"
            :size="100"
            empty-color="#222"
            font-size="1.75em"
            legend-class="legend"
          >
            <span slot="legend-value">%</span>
            <p slot="legend-caption" class="legend-caption">{{ $t('construction.fomorian') }}</p>
          </VueEllipseProgress>
        </div>
        <div class="construction-wrapper text-center">
          <VueEllipseProgress
            :progress="razorProgress"
            color="#5BACF7"
            :size="100"
            empty-color="#222"
            font-size="1.75em"
            legend-class="legend"
          >
            <span slot="legend-value">%</span>
            <p slot="legend-caption" class="legend-caption">{{ $t('construction.razorback') }}</p>
          </VueEllipseProgress>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-list-group v-if="!construction || Object.keys(construction).length < 2" class="list-group-item-borderbottom">
      <NoDataItem :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import { VueEllipseProgress } from 'vue-ellipse-progress';

import NoDataItem from '@/components/NoDataItem.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';

export default {
  name: 'ConstructionPanel',
  components: {
    NoDataItem,
    HubPanelWrap,
    VueEllipseProgress,
  },
  props: {
    construction: {
      type: Object,
      default: () => ({
        fomorianProgress: 0,
        razorbackProgress: 0,
      }),
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      loading: true,
    };
  },
  computed: {
    headertext() {
      return this.$t('construction.header');
    },
    fomoProgress() {
      return this.percent(this.construction.fomorianProgress);
    },
    razorProgress() {
      return this.percent(this.construction.razorbackProgress);
    },
  },
  methods: {
    percent: (str) => Number.parseFloat(Number.parseFloat(str || '0.00').toFixed(2)),
  },
};
</script>

<style>
.construction-wrapper {
  width: 50%;
  float: left;
}
</style>

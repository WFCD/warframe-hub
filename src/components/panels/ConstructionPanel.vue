<template>
  <HubPanelWrap :title="headertext" class="construction">
    <b-list-group>
      <b-list-group-item
        v-if="construction && Object.keys(construction).length > 2"
        class="list-group-item-borderbottom"
      >
        <div class="construction-wrapper text-center">
          <VueCircle
            ref="fomoProgress"
            :progress="0"
            :size="75"
            :fill="{ color: '#ff0000' }"
            class="prog-circle"
            title="Fomorian Progress"
            :start-angle="-Math.PI / 2"
          ></VueCircle>
          <div class="text-center">Fomorian</div>
        </div>
        <div class="construction-wrapper text-center">
          <VueCircle
            ref="razorProgress"
            :progress="0"
            :size="75"
            :fill="{ color: '#5BACF7' }"
            class="prog-circle"
            title="Razorback Progress"
            :start-angle="-Math.PI / 2"
          ></VueCircle>
          <div class="text-center">Razorback</div>
        </div>
        <div class="construction-wrapper text-center">
          <VueCircle
            ref="unkProgress"
            :progress="0"
            :size="75"
            :fill="{ color: '#738BDA' }"
            class="prog-circle"
            title="Unknown Progress"
            :start-angle="-Math.PI / 2"
          ></VueCircle>
          <div class="text-center">Unknown</div>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-list-group v-if="!construction || Object.keys(construction).length < 2" class="list-group-item-borderbottom">
      <NoDataItem :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<style>
.construction-wrapper {
  width: 33%;
  float: left;
}
</style>

<script>
import VueCircle from 'vue2-circle-progress';

import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  name: 'Construction',
  props: ['construction'],
  computed: {
    headertext() {
      return 'Construction Progress';
    },
  },
  methods: {
    percent: (str) => Number.parseFloat(str || '0.00'),
  },
  mounted() {
    this.$refs.fomoProgress.updateProgress(this.percent(this.construction.fomorianProgress));
    this.$refs.razorProgress.updateProgress(this.percent(this.construction.razorbackProgress));
    this.$refs.unkProgress.updateProgress(this.percent(this.construction.unknownProgress));
  },
  updated() {
    this.$refs.fomoProgress.updateProgress(this.percent(this.construction.fomorianProgress));
    this.$refs.razorProgress.updateProgress(this.percent(this.construction.razorbackProgress));
    this.$refs.unkProgress.updateProgress(this.percent(this.construction.unknownProgress));
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
    };
  },
  components: {
    NoDataItem,
    HubPanelWrap,
    VueCircle,
  },
};
</script>

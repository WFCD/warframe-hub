<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom">
        <div class="construction-wrapper text-center">
          <VueCircle
            :progress="percent(construction.fomorianProgress)"
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
            :progress="percent(construction.razorbackProgress)"
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
            :progress="percent(construction.unknownProgress)"
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
    percent: (str) => Number.parseFloat(str),
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

<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <span class="pull-left">
          <b>Reward Timer Reset in:</b>
        </span>
        <TimeBadge :starttime="this.time2" :endtime="this.time1"/>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import moment from 'moment';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  props: ['time', 'location'],
  name: 'ResetPanel',
  computed: {
    headertext() {
      return 'Daily Reward Timer reset';
    }
  },
  data() {
    return {
      time1: moment().toISOString(),
      time2: moment()
        .endOf('day')
        .add(1, 'seconds')
        .toISOString(),
      styleObject: {
        display: 'inline'
      }
    };
  },
  mounted() {
    this.gettime();
  },
  methods: {
    gettime: function() {
      this.time2 = moment().toISOString();
      this.time1 = moment()
        .endOf('day')
        .add(1, 'seconds')
        .toISOString();
    }
  },
  components: {
    TimeBadge,
    HubPanelWrap,
  }
};
</script>

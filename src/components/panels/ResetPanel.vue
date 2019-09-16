<template>
  <HubPanelWrap :title="headertext" class="reset">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <span class="pull-left">
          <b>Reward Timer Reset in:</b>
        </span>
        <TimeBadge :starttime="this.now" :endtime="this.nextDay" :interval="1000" />
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
      return 'Daily Reward Timer Reset';
    },
  },
  data() {
    return {
      now: moment().toISOString(),
      nextDay: moment()
        .utc()
        .endOf('day')
        .add(1, 'seconds')
        .toISOString(),
      styleObject: {
        display: 'inline',
      },
    };
  },
  mounted() {
    this.gettime();
  },
  methods: {
    gettime: function() {
      this.now = moment().toISOString();
      this.nextDay = moment()
        .utc()
        .endOf('day')
        .add(1, 'seconds')
        .toISOString();
    },
  },
  components: {
    TimeBadge,
    HubPanelWrap,
  },
};
</script>

<template>
  <HubPanelWrap :title="headertext" class="reset">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <span class="pull-left">
          <b>{{ this.$t('reset.label') }}</b>
        </span>
        <TimeBadge :starttime="this.now" :endtime="this.nextDay" :interval="1000" />
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  props: ['time', 'location'],
  name: 'ResetPanel',
  computed: {
    headertext() {
      return this.$t('reset.header');
    },
  },
  data() {
    return {
      now: dayjs().toISOString(),
      nextDay: dayjs().utc().endOf('day').add(1, 'seconds').toISOString(),
      styleObject: {
        display: 'inline',
      },
    };
  },
  mounted() {
    this.gettime();
  },
  methods: {
    gettime: function () {
      this.now = dayjs().toISOString();
      this.nextDay = dayjs().utc().endOf('day').add(1, 'seconds').toISOString();
    },
  },
  components: {
    TimeBadge,
    HubPanelWrap,
  },
};
</script>

<template>
  <HubPanelWrap :title="headertext">
    <div class="w-full">
      <div class="flex mb-4">
        <div class="flex-1">
          <span class="pull-left">
            <b>Currently it is:</b>
          </span>
        </div>
        <div class="flex-1">
          <span
            v-if="time.isDay && location !== 'Vallis'"
            class="pull-right day"
            >Day</span
          >
          <span
            v-else-if="location !== 'Vallis' && !time.isDay"
            class="pull-right night"
            >Night</span
          >
          <span
            v-else-if="location == 'Vallis' && !time.isWarm"
            class="pull-right cold"
            >Cold</span
          >
          <span v-else class="pull-right day">Warm</span>
        </div>
      </div>
      <div class="flex mb-4">
        <div class="flex-1">
          <span class="pull-left" v-if="location !== 'Vallis'">
            <b>
              Time until
              <span v-if="!time.isDay">Day</span>
              <span v-else>Night</span>:
            </b>
          </span>
          <span class="pull-left" v-else>
            <b>
              Time until
              <span v-if="time.isWarm">Cold</span>
              <span v-else>Warm</span>:
            </b>
          </span>
          <TimeBadge
            class="self-end"
            :starttime="now"
            :endtime="time.expiry"
            :interval="1000"
          />
        </div>
      </div>
    </div>
  </HubPanelWrap>
</template>
<style scoped>
.night:before {
  color: rgba(51, 211, 255, 0.8);
  content: '🌙 ';
}
.cold:before {
  color: rgba(51, 211, 255, 0.8);
  content: '\2744 ';
}
.day:before {
  color: rgba(249, 168, 6, 0.8);
  content: '☀ ';
}
</style>
<script>
import TimeBadge from '@/components/TimeBadge.vue';
import moment from 'moment';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  props: ['time', 'location'],
  name: 'TimePanel',
  computed: {
    earthtimezonetime() {
      return moment(this.$props.time.expiry).format('llll');
    },
    now() {
      return moment().toISOString();
    },
    headertext() {
      if (this.$props.location === 'Vallis') {
        return `${this.$props.location} Cold/Warm Cycle`;
      } else {
        return `${this.$props.location} Day/Night Cycle`;
      }
    }
  },
  components: {
    TimeBadge,
    HubPanelWrap
  },
  data() {
    return {
      styleObject: {
        display: 'inline'
      }
    };
  }
};
</script>

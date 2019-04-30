<template>
  <div class=" max-w-md   h-auto rounded overflow-hidden  border-transparent">
    <div class="font-bold text-default text-4xl mt-1 bg-transparent ">
      {{ headertext }}
    </div>
    <div class=" text-default w-full bg-bgnew shadow-lg pb-2 ">
      <div class="flex justify-between mx-2 pt-1 mb-2">
        <div>
          <span class="pull-left">
            <b>Currently it is:</b>
          </span>
        </div>
        <div>
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
      <div class="flex justify-between mx-2 mb-2" v-if="location !== 'Vallis'">
        <div>
          <b>
            Time until
            <span v-if="!time.isDay">Day</span>
            <span v-else>Night</span>:
          </b>
        </div>
        <div>
          <TimeBadge
            class="pull-right"
            :starttime="now"
            :endtime="time.expiry"
            :interval="1000"
          />
        </div>
      </div>
      <div class="flex justify-between mx-2 mb-2" v-else>
        <div>
          <b>
            Time until
            <span v-if="time.isWarm">Cold</span>
            <span v-else>Warm</span>:
          </b>
        </div>
        <div>
          <TimeBadge
            class="self-end"
            :starttime="now"
            :endtime="time.expiry"
            :interval="1000"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.night:before {
  color: #ecc94b;
  content: '🌙 ';
}

.cold:before {
  color: #90cdf4;
  content: '\2744 ';
}

.day:before {
  color: #ecc94b;
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

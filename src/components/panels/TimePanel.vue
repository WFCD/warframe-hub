<template>
  <HubPanelWrap :title="headertext" class="time" :class="[(location || 'sol').toLowerCase()]">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <div class="row">
          <div class="col-md-9">
            <span
              class="pull-left"
              v-bind:class="{
                day: time.state === 'day',
                night: time.state === 'night',
                warm: time.state === 'warm',
                cold: time.state === 'cold',
                fass: time.active === 'fass',
                vome: time.active === 'vome',
              }"
            >
              <span style="text-transform: capitalize">{{
                time.state || time.active
                  ? this.$t(`time.${(time.state || time.active).toLowerCase()}`)
                  : display
              }}</span>
            </span>
          </div>
          <div class="col-md-3">
            <TimeBadge :starttime="time.activation || now" :endtime="time.expiry" :interval="1000" />
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import dayjs from 'dayjs';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  props: ['time', 'location', 'display', 'headerPath'],
  name: 'TimePanel',
  computed: {
    now() {
      return dayjs().toISOString();
    },
    headertext() {
      return this.$props.headerPath
        ?  this.$t(this.$props.headerPath)
        : `${this.$t(`location.${this.$props.location.toLowerCase()}`)} ${this.$t('time.Timer')}`;
    },
  },
  components: {
    TimeBadge,
    HubPanelWrap,
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
    };
  },
};
</script>

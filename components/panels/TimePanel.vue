<template>
  <HubPanelWrap :title="headertext" class="time" :class="[(location || 'sol').toLowerCase()]">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <span
          class="pull-left"
          :class="{
            day: isDay,
            night: isNight,
            warm: isWarm,
            cold: isCold,
            fass: isFass,
            vome: isVome,
          }"
        >
          <span style="text-transform: capitalize">{{
            time && (time.state || time.active) ? $t(`time.${(time.state || time.active).toLowerCase()}`) : display
          }}</span>
        </span>
        <TimeBadge
          class="pull-right"
          :starttime="(time && time.activation) || now"
          :endtime="(time && time.expiry) || now"
          :interval="1000"
        />
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import dayjs from 'dayjs';
import TimeBadge from '@/components/TimeBadge.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';

export default {
  name: 'TimePanel',
  components: {
    TimeBadge,
    HubPanelWrap,
  },
  props: {
    time: {
      type: Object,
      default: () => ({
        state: undefined,
        active: undefined,
      }),
    },
    location: {
      type: String,
      default: () => 'sol',
    },
    display: {
      type: String,
      default: () => 'Time',
    },
    headerPath: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
    };
  },
  computed: {
    now() {
      return dayjs().toISOString();
    },
    headertext() {
      return this.$props.headerPath
        ? this.$t(this.$props.headerPath)
        : `${this.$t(`location.${this.$props.location.toLowerCase()}`)} ${this.$t('time.Timer')}`;
    },
    isDay() {
      return this && this.time && this.time.state === 'day';
    },
    isNight() {
      return this && this.time && this.time.state === 'night';
    },
    isWarm() {
      return this && this.time && this.time.state === 'warm';
    },
    isCold() {
      return this && this.time && this.time.state === 'cold';
    },
    isFass() {
      return this && this.time && this.time.active === 'fass';
    },
    isVome() {
      return this && this.time && this.time.active === 'vome';
    },
  },
};
</script>

<template>
  <HubPanelWrap :title="headertext" class="time" :class="[(location || 'sol').toLowerCase()]">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <span
          class="pull-left"
          v-bind:class="{
            day: this.isDay,
            night: this.isNight,
            warm: this.isWarm,
            cold: this.isCold,
            fass: this.isFass,
            vome: this.isVome,
          }"
        >
          <span style="text-transform: capitalize">{{
            time && (time.state || time.active) ? this.$t(`time.${(time.state || time.active).toLowerCase()}`) : display
          }}</span>
        </span>
        <TimeBadge
          class="pull-right"
          :starttime="(time && time.activation) || now"
          :endtime="time.expiry"
          :interval="1000"
        />
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

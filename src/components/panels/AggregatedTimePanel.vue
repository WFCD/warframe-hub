<template>
  <HubPanelWrap :title="headertext" class="time">
    <b-list-group>
      <!-- EARTH TIMER -->
      <b-list-group-item :style="styleObject">
        <span
          class="pull-left"
          v-bind:class="{
            day: isEarthDay,
            night: isEarthNight,
          }"
        >
          <span :style="textStyle">{{
            this.$t(`location.earth`) + " - " + this.$t(`time.${(earthCycle.state).toLowerCase()}`)
          }}</span>
        </span>
        <TimeBadge class="pull-right" :starttime="earthCycle.activation || now" :endtime="earthCycle.expiry" :interval="1000" />
      </b-list-group-item>
      <!-- CETUS TIMER -->
      <b-list-group-item :style="styleObject">
        <span
          class="pull-left"
          v-bind:class="{
            day: isCetusDay,
            night: isCetusNight,
          }"
        >
          <span :style="textStyle">{{
            this.$t(`location.cetus`) + " - " + this.$t(`time.${(cetusCycle.state).toLowerCase()}`)
          }}</span>
        </span>
        <TimeBadge class="pull-right" :starttime="cetusCycle.activation || now" :endtime="cetusCycle.expiry" :interval="1000" />
      </b-list-group-item>
      <!-- VALLIS TIMER -->
      <b-list-group-item :style="styleObject">
        <span
          class="pull-left"
          v-bind:class="{
            warm: isVallisWarm,
            cold: isVallisCold,
          }"
        >
          <span :style="textStyle">{{
            this.$t(`location.vallis`) + " - " + this.$t(`time.${(vallisCycle.state).toLowerCase()}`)
          }}</span>
        </span>
        <TimeBadge class="pull-right" :starttime="vallisCycle.activation || now" :endtime="vallisCycle.expiry" :interval="1000" />
      </b-list-group-item>
      <!-- CAMBION TIMER -->
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <span
          class="pull-left"
          v-bind:class="{
            fass: isCambionFass,
            vome: isCambionVome,
          }"
        >
          <span :style="textStyle">{{
            this.$t(`location.cambion`) + " - " + this.$t(`time.${(cambionCycle.active).toLowerCase()}`)
          }}</span>
        </span>
        <TimeBadge class="pull-right" :starttime="cambionCycle.activation || now" :endtime="cambionCycle.expiry" :interval="1000" />
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import dayjs from 'dayjs';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  props: ['worldstate'],
  name: 'AggregatedTimePanel',
  computed: {
    now() {
      return dayjs().toISOString();
    },
    headertext() {
      return `${this.$t('time.Timer')}`;
    },
    earthCycle() {
      return this.worldstate.earthCycle;
    },
    isEarthDay() {
      return this.worldstate.earthCycle.isDay;
    },
    isEarthNight() {
      return !this.worldstate.earthCycle.isDay;
    },
    cetusCycle() {
      return this.worldstate.cetusCycle;
    },
    isCetusDay() {
      return this.worldstate.cetusCycle.isDay;
    },
    isCetusNight() {
      return !this.worldstate.cetusCycle.isDay;
    },
    vallisCycle() {
      return this.worldstate.vallisCycle;
    },
    isVallisWarm() {
      return this.worldstate.vallisCycle.isWarm;
    },
    isVallisCold() {
      return !this.worldstate.vallisCycle.isWarm;
    },
    cambionCycle() {
      return this.worldstate.cambionCycle;
    },
    isCambionFass() {
      return this.worldstate.cambionCycle.active == 'fass';
    },
    isCambionVome() {
      return this.worldstate.cambionCycle.active == 'vome';
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
      textStyle: {
        'text-transform': 'capitalize',
        'margin-left': '20px',
      }
    };
  },
};
</script>

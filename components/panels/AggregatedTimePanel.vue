<template>
  <HubPanelWrap :title="headertext" class="time">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom">
        <div class="container">
          <!-- EARTH TIMER -->
          <div class="row justify-content-center">
            <div v-if="componentState.earth.display" class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ $t(`location.earth`) }}
                <br />
                <i v-if="isEarthDay" class="fa fa-sun fa-2x day" :style="textStyle"></i>
                <i v-if="isEarthNight" class="fa fa-moon fa-2x night" :style="textStyle"></i>
                <br />
                {{ $t(`time.${earthCycle.state.toLowerCase()}`) }}
              </span>
              <br />
              <TimeBadge
                :starttime="earthCycle.activation || now"
                :endtime="earthCycle.expiry"
                :interval="1000"
                :pullright="false"
              />
            </div>
            <!-- CETUS TIMER -->
            <div v-if="componentState.cetus.display" class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ $t(`location.cetus`) }}
                <br />
                <i v-if="isCetusDay" class="fa fa-sun fa-2x day" :style="textStyle"></i>
                <i v-if="isCetusNight" class="fa fa-moon fa-2x night" :style="textStyle"></i>
                <br />
                {{ $t(`time.${cetusCycle.state.toLowerCase()}`) }}
              </span>
              <br />
              <TimeBadge
                :starttime="cetusCycle.activation || now"
                :endtime="cetusCycle.expiry"
                :interval="1000"
                :pullright="false"
              />
            </div>
            <!-- VALLIS TIMER -->
            <div v-if="componentState.vallis.display" class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ $t(`location.vallis`) }}
                <br />
                <i v-if="isVallisWarm" class="fa fa-fire fa-2x warm" :style="textStyle"></i>
                <i v-if="isVallisCold" class="fa fa-snowflake fa-2x cold" :style="textStyle"></i>
                <br />
                {{ $t(`time.${vallisCycle.state.toLowerCase()}`) }}
              </span>
              <br />
              <TimeBadge
                :starttime="vallisCycle.activation || now"
                :endtime="vallisCycle.expiry"
                :interval="1000"
                :pullright="false"
              />
            </div>
            <!-- CAMBION TIMER -->
            <div v-if="componentState.cambion.display" class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ $t(`location.cambion`) }}
                <br />
                <i v-if="isCambionFass" class="fa fa-sun fa-2x day" :style="textStyle"></i>
                <i v-if="isCambionVome" class="fa fa-moon fa-2x night" :style="textStyle"></i>
                <br />
                {{ $t(`time.${cambionCycle.active.toLowerCase()}`) }}
              </span>
              <br />
              <TimeBadge
                :starttime="cambionCycle.activation || now"
                :endtime="cambionCycle.expiry"
                :interval="1000"
                :pullright="false"
              />
            </div>
            <!-- DAILY TIMER -->
            <div v-if="componentState.reset.display" class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ $t('reset.header') }}
              </span>
              <br />
              <TimeBadge :starttime="now" :endtime="nextDay" :interval="1000" :pullright="false" />
            </div>
            <!-- ANOMALY -->
            <div
              v-if="isSentientOutpostActive && componentState.sentientoutposts.display"
              class="col-sm-3 my-3 text-center"
            >
              <span :style="textStyle">
                {{ $t('sentientoutpost.header') }}
              </span>
              <HubImg
                id="para_tooltip"
                :src="sentientImg"
                :name="$t('factions.sentient') + ' | ' + $t('sentientoutpost.warn')"
                width="20px"
                height="20px"
                class="invert"
              />
              <br />
              <b>{{ worldstate.sentientOutposts.mission.node }}</b>
              <br />
              {{ worldstate.sentientOutposts.mission.type }}
            </div>
            <!-- STEEL ESSENCE -->
            <div v-if="componentState['steel-path'].display" class="col-sm-3 my-3">
              <span :style="textStyle">{{ $t('steelPath.header') }}</span>
              <HubImg
                :src="cdn('svg/sp-logo.svg')"
                :name="$t('steelPath.header')"
                class="li-mission-decorator li-mission-decorator-lg invert mx-1"
                height="20px"
                width="20px"
              />
              <br />
              <span style="font-size: 0.85em">
                <b>{{ worldstate && worldstate.steelPath && worldstate.steelPath.currentReward.name }}</b>
              </span>
              <br />
              {{ worldstate && worldstate.steelPath && worldstate.steelPath.currentReward.cost }}
              <hub-img
                :src="optimize(wfcdn('steel-essence.png'), '250x250', 'fill', 'center')"
                :name="$t('currency.steelEssense')"
              />
              <TimeBadge
                :starttime="(worldstate && worldstate.steelPath && worldstate.steelPath.activation) || '0'"
                :endtime="(worldstate && worldstate.steelPath && worldstate.steelPath.expiry) || '0'"
                :interval="1000"
                :pullright="false"
              />
            </div>
            <!-- ARBITRATION TIMER -->
            <div v-if="isArbitrationActive && componentState.arbitration.display" class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ $t('arbitration.header') }}
              </span>
              <HubImg
                :src="factionImg"
                :name="worldstate.arbitration.enemy"
                class="li-mission-decorator li-mission-decorator-lg"
                height="20px"
                width="20px"
              />
              <br />
              <b>{{ worldstate.arbitration.node }}</b>
              <br />
              {{ worldstate.arbitration.type }}
              <TimeBadge
                :starttime="worldstate.arbitration.activation"
                :endtime="worldstate.arbitration.expiry"
                :interval="1000"
                :pullright="false"
              />
            </div>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { mapState } from 'vuex';
import TimeBadge from '@/components/TimeBadge.vue';

import HubPanelWrap from '@/components/HubPanelWrap';
import HubImg from '@/components/HubImg.vue';

import { cdn, wfcdn, optimize } from '@/services/utilities.js';

dayjs.extend(utc);

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

const fImg = {
  corpus,
  grineer,
  infested,
  infestation: infested,
  corrupted,
  orokin: corrupted,
  sentient,
};

const cycleDefault = {
  activation: '0',
  expiry: '0',
  isWarm: true,
  active: 'Fass',
  isDay: true,
};

export default {
  name: 'AggregatedTimePanel',
  components: {
    TimeBadge,
    HubImg,
    HubPanelWrap,
  },
  props: {
    worldstate: {
      type: Object,
      default: () => ({
        cetusCycle: cycleDefault,
        earthCycle: cycleDefault,
        cambionCycle: cycleDefault,
        sentientOutposts: {},
        steelPath: {
          activation: 0,
          expiry: 0,
        },
      }),
    },
  },
  data() {
    return {
      textStyle: {
        'text-transform': 'capitalize',
      },
    };
  },
  computed: {
    ...mapState({
      componentState: (state) => state.worldstate.components,
    }),
    now() {
      return dayjs().toISOString();
    },
    nextDay() {
      return dayjs.utc().endOf('day').add(1, 'seconds').toISOString();
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
      return this.worldstate.cambionCycle.active === 'fass';
    },
    isCambionVome() {
      return this.worldstate.cambionCycle.active === 'vome';
    },
    factionImg() {
      if (this.worldstate && this.worldstate.arbitration && this.worldstate.arbitration.enemy) {
        return fImg[this.worldstate.arbitration.enemy.toLowerCase()] || corrupted;
      }
      return corrupted;
    },
    sentientImg() {
      return sentient;
    },
    isArbitrationActive() {
      return dayjs(this.worldstate.arbitration.expiry).format('x') <= dayjs().format('x');
    },
    isSentientOutpostActive() {
      return this.worldstate.sentientOutposts.active;
    },
  },
  methods: {
    cdn,
    wfcdn,
    optimize,
  },
};
</script>

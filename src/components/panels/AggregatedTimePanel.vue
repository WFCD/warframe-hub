<template>
  <HubPanelWrap :title="headertext" class="time">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom">
        <div class="container">
          <!-- EARTH TIMER -->
          <div class="row justify-content-center">
            <div class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ this.$t(`location.earth`) }}
                <br />
                <i v-if="isEarthDay" class="fa fa-sun fa-2x" :style="textStyle"></i>
                <i v-if="isEarthNight" class="fa fa-moon fa-2x" :style="textStyle"></i>
                <br />
                {{ this.$t(`time.${earthCycle.state.toLowerCase()}`) }}
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
            <div class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ this.$t(`location.cetus`) }}
                <br />
                <i v-if="isCetusDay" class="fa fa-sun fa-2x" :style="textStyle"></i>
                <i v-if="isCetusNight" class="fa fa-moon fa-2x" :style="textStyle"></i>
                <br />
                {{ this.$t(`time.${cetusCycle.state.toLowerCase()}`) }}
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
            <div class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ this.$t(`location.vallis`) }}
                <br />
                <i v-if="isVallisWarm" class="fa fa-fire fa-2x" :style="textStyle"></i>
                <i v-if="isVallisCold" class="fa fa-snowflake fa-2x" :style="textStyle"></i>
                <br />
                {{ this.$t(`time.${vallisCycle.state.toLowerCase()}`) }}
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
            <div class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ this.$t(`location.cambion`) }}
                <br />
                <i v-if="isCambionFass" class="fa fa-sun fa-2x" :style="textStyle"></i>
                <i v-if="isCambionVome" class="fa fa-moon fa-2x" :style="textStyle"></i>
                <br />
                {{ this.$t(`time.${cambionCycle.active.toLowerCase()}`) }}
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
            <div class="col-sm-3 my-3">
              <span :style="textStyle">
                {{ this.$t('reset.header') }}
              </span>
              <br />
              <TimeBadge :starttime="this.now" :endtime="this.nextDay" :interval="1000" :pullright="false" />
            </div>
            <!-- ANOMALY -->
            <div v-if="isSentientOutpostActive" class="col-sm-3 my-3 text-center">
              <span :style="textStyle">
                {{ this.$t('sentientoutpost.header') }}
              </span>
              <HubImg
                id="para_tooltip"
                :src="sentientImg"
                :name="this.$t('factions.sentient') + ' | ' + this.$t('sentientoutpost.warn')"
                width="20px"
                height="20px"
                :style="invert"
              />
              <br />
              <b>{{ this.worldstate.sentientOutposts.mission.node }}</b>
              <br />
              {{ this.worldstate.sentientOutposts.mission.type }}
            </div>
            <!-- STEEL ESSENSE -->
            <div class="col-sm-12 my-3">
              <span :style="textStyle">{{ this.$t('steelPath.header') }} - </span>
              <b>{{ this.worldstate.steelPath.currentReward.name }}</b>
              ({{ `${this.worldstate.steelPath.currentReward.cost} ${this.$t('currency.steelEssense')}` }})
              <TimeBadge
                :starttime="this.worldstate.steelPath.activation"
                :endtime="this.worldstate.steelPath.expiry"
                :interval="1000"
                :pullright="false"
              />
            </div>
            <!-- ARBITRATION TIMER -->
            <div v-if="isArbitrationActive" class="col-sm-12">
              <span :style="textStyle">
                {{ this.$t('arbitration.header') }}
              </span>
              <HubImg
                :src="factionImg"
                :name="this.worldstate.arbitration.enemy"
                :style="invert"
                class="li-mission-decorator li-mission-decorator-lg"
                height="20px"
                width="20px"
              />
              <b>{{ this.worldstate.arbitration.node }}</b>
              | {{ this.worldstate.arbitration.type }}
              <TimeBadge
                :starttime="this.worldstate.arbitration.activation"
                :endtime="this.worldstate.arbitration.expiry"
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
import TimeBadge from '@/components/TimeBadge.vue';
import dayjs from 'dayjs';
import HubPanelWrap from '@/components/HubPanelWrap';
import HubImg from '@/components/HubImg.vue';

import { cdn } from '@/utilities.js';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

export default {
  props: ['worldstate'],
  name: 'AggregatedTimePanel',
  computed: {
    now() {
      return dayjs().toISOString();
    },
    nextDay() {
      return dayjs().endOf('day').add(1, 'seconds').toISOString();
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
    factionImg() {
      var fImg = {
        corpus: corpus,
        grineer: grineer,
        infested: infested,
        infestation: infested,
        corrupted: corrupted,
        orokin: corrupted,
        sentient: sentient,
      };
      return fImg[this.worldstate.arbitration.enemy.toLowerCase()] || corrupted;
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
  components: {
    TimeBadge,
    HubImg,
    HubPanelWrap,
  },
  data() {
    return {
      invert: {
        filter: 'invert(100%)',
      },
      textStyle: {
        'text-transform': 'capitalize',
      },
    };
  },
};
</script>

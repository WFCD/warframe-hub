<template>
  <HubPanelWrap :title="headertext" class="sentientoutpost">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom" v-if="sentientOutposts.active">
        <span class="pull-left">
          <HubImg :src="sentient" :name="this.$t('factions.sentient')" :style="factionImg" width="20px" height="20px" />
          <b>{{ sentientOutposts.mission.node }}</b> - {{ sentientOutposts.mission.faction }} -
          {{ sentientOutposts.mission.type }}
          <i id="para_tooltip" class="fa-xs fas fa-exclamation-triangle"></i>
          <b-tooltip target="para_tooltip" placement="top" class="text-center">
            {{ $t('sentientoutpost.warn') }}
          </b-tooltip>
        </span>
        <TimeBadge :starttime="curr.activation" :endtime="curr.expiry" :interval="1000" />
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom p-2" v-if="!sentientOutposts.active">
        <span class="pull-left">
          <i class="far fa-eye-slash faIcon" v-b-tooltip :title="this.$t('sentientoutpost.none')"></i>
          <b>Prediction</b>
        </span>
        <TimeBadge :starttime="predNext.activation" :endtime="predNext.expiry" :interval="1000" />
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import HubImg from '@/components/HubImg.vue';

import moment from 'moment';

import sentient from '@/assets/img/factions/sentient.svg';

export default {
  name: 'SentientOutpostsPanel',
  props: ['sentientOutposts'],
  computed: {
    headertext() {
      return this.$t('sentientoutpost.header');
    },
    curr() {
      const defStart = new Date(this.$props.sentientOutposts.activation).getTime();
      const defEnd = new Date(this.$props.sentientOutposts.expiry).getTime();
      const predStart = new Date(this.$props.sentientOutposts.previous.activation).getTime();
      const predEnd = new Date(this.$props.sentientOutposts.previous.expiry).getTime();
      if (defStart < predStart) {
        return {
          activation: moment(defStart).toISOString(),
          expiry: moment(defEnd).toISOString(),
        };
      } else {
        return {
          activation: moment(predStart).toISOString(),
          expiry: moment(predEnd).toISOString(),
        };
      }
    },
    predNext() {
      const defStart = new Date(this.$props.sentientOutposts.activation).getTime();
      const defEnd = new Date(this.$props.sentientOutposts.expiry).getTime();
      const predStart = new Date(this.$props.sentientOutposts.previous.activation).getTime();
      const predEnd = new Date(this.$props.sentientOutposts.previous.expiry).getTime();
      if (defStart > predStart) {
        return {
          activation: moment(defStart).toISOString(),
          expiry: moment(defEnd).toISOString(),
        };
      } else {
        return {
          activation: moment(predStart).toISOString(),
          expiry: moment(predEnd).toISOString(),
        };
      }
    },
  },
  data() {
    return {
      sentient: sentient,
      factionImg: {
        filter: 'invert(100%)',
        'margin-top': '-3px',
        'margin-right': '5px',
        width: '25px',
        height: '25px',
      },
    };
  },
  components: {
    HubPanelWrap,
    TimeBadge,
    HubImg,
  },
  methods: {
    now() {
      return new Date().toString();
    },
  },
};
</script>

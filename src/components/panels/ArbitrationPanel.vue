<template>
  <HubPanelWrap :title="headertext" class="arbitration">
    <b-list-group>
      <b-list-group-item
        v-if="Object.keys(arbitration).length != 0 && notExpired"
        :style="styleObject"
        class="list-group-item-borderbottom"
      >
        <span class="pull-left">
          <HubImg
            :src="factionImg"
            :name="arbitration.enemy"
            :style="invert"
            class="li-mission-decorator li-mission-decorator-lg"
            height="20px"
            width="20px"
          />
          <b>{{ arbitration.node }}</b> | {{ arbitration.type }}
        </span>
        <TimeBadge :starttime="arbitration.activation" :endtime="arbitration.expiry" :interval="1000" />
      </b-list-group-item>
      <NoDataItem v-else :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import HubImg from '@/components/HubImg.vue';
import TimeBadge from '@/components/TimeBadge.vue';
import dayjs from 'dayjs';
import HubPanelWrap from '@/components/HubPanelWrap';
import NoDataItem from '@/components/NoDataItem.vue';

import { cdn } from '@/utilities.js';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

export default {
  props: ['arbitration'],
  name: 'ArbitrationPanel',
  computed: {
    notExpired() {
      return dayjs(this.$props.arbitration.expiry).format('x') >= dayjs().format('x');
    },
    now() {
      return dayjs().toISOString();
    },
    headertext() {
      return this.$t('arbitration.header');
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
      return fImg[this.$props.arbitration.enemy.toLowerCase()] || corrupted;
    },
  },
  components: {
    TimeBadge,
    HubImg,
    NoDataItem,
    HubPanelWrap,
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      invert: {
        filter: 'invert(100%)',
      },
    };
  },
};
</script>

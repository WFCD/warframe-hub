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
import moment from 'moment';
import HubPanelWrap from '@/components/HubPanelWrap';
import NoDataItem from '@/components/NoDataItem.vue';

import corpus from '@/assets/img/factions/corpus.svg';
import corrupted from '@/assets/img/factions/corrupted.svg';
import grineer from '@/assets/img/factions/grineer.svg';
import infested from '@/assets/img/factions/infested.svg';
import sentient from '@/assets/img/factions/sentient.svg';

export default {
  props: ['arbitration'],
  name: 'ArbitrationPanel',
  computed: {
    notExpired() {
      return moment(this.$props.arbitration.expiry).format('x') >= moment().format('x');
    },
    now() {
      return moment().toISOString();
    },
    headertext() {
      return 'Arbitration';
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

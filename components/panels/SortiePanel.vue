<template>
  <HubPanelWrap :title="headertext" class="sortie">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderless pb-0">
        <span class="pull-left">
          <h4 class="my-0">
            <HubImg :src="factionImg" :name="sortie.faction" :style="missionType" width="20px" height="20px" />
            {{ sortie.boss }}
          </h4>
        </span>
        <TimeBadge :starttime="now" :endtime="sortie.expiry" :interval="1000" />
      </b-list-group-item>
      <b-list-group-item
        v-for="(mission, index) in sortie.variants"
        :key="`sortie-${index}`"
        :style="styleObject"
        :class="{
          'list-group-item-borderless': index !== sortie.variants.length - 1,
          'pb-0': index !== sortie.variants.length - 1,
          'list-group-item-borderbottom': index === sortie.variants.length - 1,
        }"
      >
        <div class="ml-3">
          <span class="pull-left pr-2">
            <b>{{ mission.missionType }} - {{ mission.node }}</b>
          </span>
          <span v-b-tooltip.top :title="mission.modifierDescription" class="pull-left">
            {{ mission.modifier }}
          </span>
        </div>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import dayjs from 'dayjs';

import HubImg from '@/components/HubImg.jsx';
import TimeBadge from '@/components/TimeBadge.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';
import { cdn } from '@/services/utilities';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

export default {
  name: 'SortiePanel',
  components: {
    TimeBadge,
    HubImg,
    HubPanelWrap,
  },
  props: ['sortie'],
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      missionType: {
        filter: 'invert(100%)',
        'margin-top': '-3px',
        'margin-right': '5px',
        width: '25px',
        height: '25px',
      },
    };
  },
  computed: {
    now() {
      return dayjs().toISOString();
    },
    headertext() {
      return this.$t('sortie.header');
    },
    factionImg() {
      const fImg = {
        corpus,
        grineer,
        infested,
        infestation: infested,
        corrupted,
        orokin: corrupted,
        sentient,
      };
      return fImg[this.$props.sortie.faction.toLowerCase()] || corrupted;
    },
  },
};
</script>

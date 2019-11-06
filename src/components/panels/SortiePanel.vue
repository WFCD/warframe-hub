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
        :style="styleObject"
        v-for="(mission, index) in sortie.variants"
        :key="`sortie-${index}`"
        v-bind:class="{
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
import HubImg from '@/components/HubImg.vue';
import TimeBadge from '@/components/TimeBadge.vue';
import moment from 'moment';
import HubPanelWrap from '@/components/HubPanelWrap';

import corpus from '@/assets/img/factions/corpus.svg';
import corrupted from '@/assets/img/factions/corrupted.svg';
import grineer from '@/assets/img/factions/grineer.svg';
import infested from '@/assets/img/factions/infested.svg';
import sentient from '@/assets/img/factions/sentient.svg';

export default {
  props: ['sortie'],
  name: 'SortiePanel',
  computed: {
    sortietimezonetime() {
      return moment(this.$props.sortie.expiry).format('llll');
    },
    now() {
      return moment().toISOString();
    },
    headertext() {
      return 'Sortie';
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
      return fImg[this.$props.sortie.faction.toLowerCase()] || corrupted;
    },
  },
  components: {
    TimeBadge,
    HubImg,
    HubPanelWrap,
  },
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
};
</script>

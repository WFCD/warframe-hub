<template>
  <HubPanelWrap :title="headertext" class="fissures">
    <b-list-group>
      <b-list-group-item
        :style="styleObject"
        v-for="(fissure, index) in filteredFissures"
        :key="fissure.id"
        v-bind:class="{
          'list-group-item-borderless': index !== filteredFissures.length - 1,
          'pb-0': index !== filteredFissures.length - 1,
          'list-group-item-borderbottom': index === filteredFissures.length - 1,
        }"
      >
        <span class="pull-left">
          <HubImg
            :src="determineImg(fissure)"
            :name="fissure.tier"
            class="li-mission-decorator li-mission-decorator-lg"
            height="24px"
            width="24px"
          />
          <b>{{ fissure.node }}</b> | {{ fissure.missionType }} |
          {{ fissure.tier }}
        </span>

        <span class="pull-right">
          <TimeBadge :starttime="fissure.activation" :endtime="fissure.expiry" :interval="1000" style="padding: 5px" />
          <HubImg
            v-if="fissure.isStorm"
            :src="archwing"
            :name="$t('fissures.voidstorm')"
            class="li-mission-decorator li-mission-decorator-lg"
            height="24px"
            width="24px"
          />
        </span>
      </b-list-group-item>
      <NoDataItem v-if="filteredFissures.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import HubImg from '@/components/HubImg.vue';
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import archwing from '@/assets/img/archwing.svg';

const fissureIcons = [];
import lith from '@/assets/img/fissures/1.svg';
import meso from '@/assets/img/fissures/2.svg';
import neo from '@/assets/img/fissures/3.svg';
import axi from '@/assets/img/fissures/4.svg';
import requiem from '@/assets/img/fissures/5.svg';
fissureIcons.push(lith);
fissureIcons.push(meso);
fissureIcons.push(neo);
fissureIcons.push(axi);
fissureIcons.push(requiem);

export default {
  name: 'Fissures',
  props: ['fissures'],
  computed: {
    headertext() {
      return this.$t('fissures.header');
    },
    filteredFissures: function () {
      const pState = [];
      Object.keys(this.$store.getters.fissurePlanetStates).forEach((p) => {
        if (this.$store.getters.fissurePlanetStates[p].state) {
          pState.push(p);
        }
      });
      const planets = new RegExp(`(${pState.join('|')})`, 'i');
      return this.fissures
        .filter((fissure) => {
          const isFiltered = planets.test(fissure.node);
          return (pState.length > 0 ? !isFiltered : true) && !fissure.expired;
        })
        .sort((a, b) => {
          return a.isStorm && !b.isStorm ? 1 : !a.isStorm && b.isStorm ? -1 : a.tierNum - b.tierNum;
        });
    },
  },
  methods: {
    determineImg: function (fissure) {
      return fissureIcons[fissure.tierNum - 1] || lith;
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
        'vertical-align': 'middle',
      },
      archwing,
    };
  },
  components: {
    TimeBadge,
    HubImg,
    NoDataItem,
    HubPanelWrap,
  },
};
</script>

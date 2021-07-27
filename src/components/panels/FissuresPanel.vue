<template>
  <HubPanelWrap :title="headertext" class="fissures">
    <b-list-group>
      <b-list-group-item
        :style="styleObject"
        v-for="(fissure, index) in filteredFissures"
        :key="fissure.id"
        class="list-group-item-borderless"
        :class="{ 'pb-0': index !== filteredFissures.length - 1 }"
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

      <NoDataItem v-if="filteredFissures.length === 0" :text="headertext" :overrideBorder="true" />
      <b-list-group-item class="list-group-item-borderbottom">
        <b-form-group
          :label="$t('fissures.choice')"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio-group
            v-model="check"
            :options="options"
            :aria-describedby="ariaDescribedby"
            button-variant="outline-primary"
            size="sm"
            name="radio-btn-outline"
            buttons
          ></b-form-radio-group>
        </b-form-group>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import { mapGetters } from 'vuex';
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
    ...mapGetters({
      fissureDisplays: 'fissureDisplays',
    }),
    headertext() {
      return this.$t('fissures.header');
    },
    check: {
      get() {
        return this.fissureDisplays;
      },
      set(value) {
        this.$store.commit('commitFissureDisplaysState', [value]);
      },
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
          let include = !fissure.expired;
          if (fissure.isStorm) {
            include = include && this.check.includes('storms');
          } else {
            include = include && this.check.includes('fissures');
          }
          return (pState.length > 0 ? !isFiltered : true) && include;
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
      options: [
        { text: this.$t('fissures.header'), value: 'fissures' },
        { text: this.$t('fissures.both'), value: 'fissures-storms'},
        { text: this.$t('fissures.voidstorm'), value: 'storms' },
      ],
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

<template>
  <HubPanelWrap :title="headertext" class="fissures">
    <b-list-group>
      <b-list-group-item
        v-for="(fissure, index) in filteredFissures"
        :key="fissure.id"
        :style="styleObject"
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
          <HubImg
            v-if="fissure.isHard"
            :src="steelPath"
            :name="$t('fissures.steelPath')"
            class="li-mission-decorator li-mission-decorator-lg no-invert"
            height="24px"
            width="24px"
          />
        </span>
      </b-list-group-item>

      <NoDataItem v-if="filteredFissures.length === 0" :text="headertext" :override-border="true" />
      <b-list-group-item class="list-group-item-borderbottom">
        <b-form-group v-slot="{ ariaDescribedby }" :label="$t('fissures.choice')">
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
import TimeBadge from '@/components/TimeBadge.jsx';
import HubImg from '@/components/HubImg.jsx';
import NoDataItem from '@/components/NoDataItem.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';
import { cdn } from '@/services/utilities';

const archwing = cdn('svg/archwing.svg');
const steelPath = cdn('svg/arbitrations.svg');

const fissureIcons = [];
const lith = cdn('svg/fissures/lith.svg');
const meso = cdn('svg/fissures/meso.svg');
const neo = cdn('svg/fissures/neo.svg');
const axi = cdn('svg/fissures/axi.svg');
const requiem = cdn('svg/fissures/requiem.svg');
fissureIcons.push(lith, meso, neo, axi, requiem);

export default {
  name: 'FissurePanel',
  components: {
    TimeBadge,
    HubImg,
    NoDataItem,
    HubPanelWrap,
  },
  props: {
    fissures: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
        'vertical-align': 'middle',
      },
      archwing,
      steelPath,
      options: [
        { text: this.$t('fissures.header'), value: 'fissures' },
        { text: this.$t('fissures.voidstorm'), value: 'storms' },
        { text: this.$t('fissures.steelPath'), value: 'steelPath' },
        { text: this.$t('fissures.all'), value: 'fissures-storms-steelPath' },
      ],
    };
  },
  computed: {
    ...mapGetters('worldstate', ['fissureDisplays', 'fissurePlanetStates']),
    headertext() {
      return this.$t('fissures.header');
    },
    check: {
      get() {
        if (this.fissureDisplays === 'fissures-storms') {
          // update, in case the site data is outdate
          this.$store.commit('worldstate/commitFissureDisplaysState', ['fissures-storms-steelPath']);
          return 'fissures-storms-steelPath';
        }
        return this.fissureDisplays;
      },
      set(value) {
        this.$store.commit('worldstate/commitFissureDisplaysState', [value]);
      },
    },
    filteredFissures() {
      const pState = [];
      Object.keys(this.fissurePlanetStates).forEach((p) => {
        if (this.fissurePlanetStates[p].state) {
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
          } else if (fissure.isHard) {
            include = include && this.check.includes('steelPath');
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
    determineImg(fissure) {
      return fissureIcons[fissure.tierNum - 1] || lith;
    },
  },
};
</script>

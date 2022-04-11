<template>
  <HubPanelWrap :title="headertext" class="nightwave">
    <b-list-group v-if="nightwave && nightwave.activeChallenges">
      <b-list-group-item
        v-for="(challenge, index) in nightwave.activeChallenges"
        :key="challenge.id"
        :style="styleObject"
        :class="{
          'list-group-item-borderless': index !== nightwave.activeChallenges.length - 1,
          'pb-0': index !== nightwave.activeChallenges.length - 1,
          'list-group-item-borderbottom': index === nightwave.activeChallenges.length - 1,
        }"
      >
        <span class="pull-left">
          <HubImg
            :src="challenge.isDaily ? daily : challenge.isElite ? elite : weekly"
            :name="type(challenge)"
            class="li-mission-decorator li-mission-decorator-lg invert"
            :height="challenge.isDaily ? '15px' : '24px'"
            width="24px"
          />
        </span>
        <span v-b-tooltip.right :title="challenge.desc" class="pull-left">
          {{ challenge.title }}
        </span>

        <TimeBadge class="pull-right" :starttime="challenge.activation" :endtime="challenge.expiry" :interval="1000" />
        <b-badge :variant="challenge.isDaily ? 'success' : challenge.isElite ? 'danger' : 'warning'" class="pull-right">
          <HubImg :src="standing" name="Standing Gain" class="invert" height="12px" width="12px" />
          {{ challenge.reputation }}
        </b-badge>
      </b-list-group-item>
    </b-list-group>
    <b-list-group v-if="!nightwave || nightwave.activeChallenges.length === 0">
      <NoDataItem :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import HubImg from '@/components/HubImg';
import { cdn } from '@/services/utilities';

const daily = cdn('webp/nightwave/daily.webp');
const weekly = cdn('webp/nightwave/weekly.webp');
const elite = cdn('webp/nightwave/elite.webp');
const standing = cdn('svg/standing.svg');

export default {
  name: 'NightwavePanel',
  components: {
    TimeBadge,
    NoDataItem,
    HubPanelWrap,
    HubImg,
  },
  props: ['nightwave'],
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      daily,
      weekly,
      elite,
      standing,
    };
  },
  computed: {
    headertext() {
      return this.$t('nightwave.header');
    },
  },
  methods: {
    type(challenge) {
      return this.$t(`nightwave.${challenge.isDaily ? 'daily' : challenge.isElite ? 'elite' : 'weekly'}`);
    },
  },
};
</script>

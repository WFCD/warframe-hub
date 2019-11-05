<template>
  <HubPanelWrap :title="headertext" class="nightwave">
    <b-list-group v-if="nightwave && nightwave.activeChallenges">
      <b-list-group-item
        :style="styleObject"
        v-for="(challenge, index) in nightwave.activeChallenges"
        :key="challenge.id"
        v-bind:class="{
          'list-group-item-borderless': index !== nightwave.activeChallenges.length - 1,
          'pb-0': index !== nightwave.activeChallenges.length - 1,
          'list-group-item-borderbottom': index === nightwave.activeChallenges.length - 1,
        }"
      >
        <span class="pull-left">
          <HubImg
            :src="challenge.isDaily ? daily : challenge.isElite ? elite : weekly"
            :name="challenge.isDaily ? 'Daily' : challenge.isElite ? 'Elite Weekly' : 'Weekly'"
            class="li-mission-decorator li-mission-decorator-lg invert"
            :height="challenge.isDaily ? '15px' : '24px'"
            width="24px"
          />
        </span>
        <span v-b-tooltip.right :title="challenge.desc" class="pull-left">
          {{ challenge.title }}
        </span>

        <TimeBadge class="pull-right" :starttime="challenge.activation" :endtime="challenge.expiry" :interval="1000" />
        <b-badge
          v-bind:variant="challenge.isDaily ? 'success' : challenge.isElite ? 'danger' : 'warning'"
          class="pull-right"
        >
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

import daily from '@/assets/img/nightwave/daily.png';
import weekly from '@/assets/img/nightwave/weekly.png';
import elite from '@/assets/img/nightwave/elite.png';
import standing from '@/assets/img/general/standing.svg';

export default {
  name: 'Nightwave',
  props: ['nightwave'],
  computed: {
    headertext() {
      return 'Nightwave';
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      daily: daily,
      weekly: weekly,
      elite: elite,
      standing: standing,
    };
  },
  components: {
    TimeBadge,
    NoDataItem,
    HubPanelWrap,
    HubImg,
  },
};
</script>

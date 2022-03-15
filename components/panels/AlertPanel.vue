<template>
  <HubPanelWrap :title="headertext" :class="{ 'no-content': alerts.length === 0 }">
    <b-list-group>
      <b-list-group-item
        v-for="(alert, index) in alerts"
        v-if="alert.active"
        :key="alert.id"
        :style="styleObject"
        :class="{
          'list-group-item-borderless': index !== alerts.length - 1,
          'list-group-item-borderbottom': index === alerts.length - 1,
        }"
      >
        <span class="pull-left">
          <HubImg
            v-if="alert.mission.archwingRequired"
            :src="archwing"
            :name="$t('alerts.archwing')"
            class="li-mission-decorator"
          />
          <HubImg
            v-if="alert.mission.nightmare"
            :src="nightmare"
            :name="$t('alerts.nightmare')"
            class="li-mission-decorator"
          />
          <b>{{ alert.mission.node }}</b>
        </span>
        <TimeBadge :starttime="alert.activation" :endtime="alert.expiry" :interval="1000" />
        <b-badge
          v-for="item in alert.mission.reward.items"
          v-if="alert.mission.reward.items.length"
          :key="item"
          variant="info"
          :style="styleObject"
          class="pull-right"
        >
          {{ item }}
        </b-badge>
        <b-badge
          v-for="item in alert.mission.reward.countedItems"
          :key="item.key"
          variant="info"
          :style="styleObject"
          class="pull-right"
        >
          {{ item.count }} {{ item.type }}
        </b-badge>
        <br />
        <b-badge v-if="alert.mission.reward.credits" variant="info" :style="styleObject" class="pull-right">
          {{ alert.mission.reward.credits }}cr
        </b-badge>
        <div style="margin-top: 2px" class="pull-left">
          <b>{{ alert.mission.type }}</b> ({{ alert.mission.faction }}) | <b>{{ $t('alerts.level') }} </b>
          {{ alert.mission.minEnemyLevel }}-{{ alert.mission.maxEnemyLevel }}
        </div>
      </b-list-group-item>
      <NoDataItem v-if="alerts.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import HubImg from '@/components/HubImg.vue';
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import { cdn } from '@/services/utilities';

const archwing = cdn('svg/archwing.svg');
const nightmare = cdn('svg/nightmare.svg');

export default {
  name: 'AlertPanel',
  components: {
    TimeBadge,
    HubImg,
    NoDataItem,
    HubPanelWrap,
  },
  props: ['alerts'],
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      archwing,
      nightmare,
    };
  },
  computed: {
    headertext() {
      return this.$t('alerts.header');
    },
  },
};
</script>
<!-- AlertPanel.vue -->

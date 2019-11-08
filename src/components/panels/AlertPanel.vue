<template>
  <HubPanelWrap :title="headertext" :class="{ 'no-content': alerts.length === 0 }">
    <b-list-group>
      <b-list-group-item
        :style="styleObject"
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :class="{
          'list-group-item-borderless': index !== alerts.length - 1,
          'list-group-item-borderbottom': index === alerts.length - 1,
        }"
        v-if="alert.active"
      >
        <span class="pull-left">
          <HubImg
            :src="archwing"
            name="Archwing Required for Mission"
            class="li-mission-decorator"
            v-if="alert.mission.archwingRequired"
          />
          <HubImg
            :src="nightmare"
            name="Nightmare Mission"
            class="li-mission-decorator"
            v-if="alert.mission.nightmare"
          />
          <b>{{ alert.mission.node }}</b>
        </span>
        <TimeBadge :starttime="alert.activation" :endtime="alert.expiry" :interval="1000" />
        <b-badge
          variant="info"
          :style="styleObject"
          v-for="item in alert.mission.reward.items"
          :key="item"
          class="pull-right"
        >
          {{ item }}
        </b-badge>
        <b-badge
          variant="info"
          :style="styleObject"
          v-for="item in alert.mission.reward.countedItems"
          :key="item"
          class="pull-right"
        >
          {{ item.count }} {{ item.type }}
        </b-badge>
        <br />
        <b-badge v-if="alert.mission.reward.credits" variant="info" :style="styleObject" class="pull-right">
          {{ alert.mission.reward.credits }}cr
        </b-badge>
        <div style="margin-top:2px" class="pull-left">
          <b>{{ alert.mission.type }}</b> ({{ alert.mission.faction }}) | <b>Level: </b>
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

import archwing from '@/assets/img/archwing.svg';
import nightmare from '@/assets/img/nightmare.svg';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  name: 'AlertPanel',
  props: ['alerts'],
  computed: {
    headertext() {
      return 'Alerts';
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      archwing: archwing,
      nightmare: nightmare,
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
<!-- AlertPanel.vue -->

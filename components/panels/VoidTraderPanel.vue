<template>
  <HubPanelWrap :title="headertext" class="baro">
    <b-list-group>
      <b-list-group-item :class="`${available() ? 'list-group-item-borderless' : 'list-group-item-borderbottom'}`">
        <span class="pull-left">{{ locationLabel() }}</span>
        <TimeBadge :starttime="voidTrader.activation" :endtime="voidTrader.expiry" :interval="1000" />
      </b-list-group-item>
      <b-list-group-item v-if="available()" class="list-group-item-borderbottom" :items="items" :fields="fields">
        <b-table class="thin item-table" :items="items" :fields="fields" />
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import dayjs from 'dayjs';

import TimeBadge from '@/components/TimeBadge.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';

export default {
  name: 'VoidTraderPanel',
  components: {
    HubPanelWrap,
    TimeBadge,
  },
  props: ['voidTrader'],
  data() {
    return {
      items: this.voidTrader.inventory || [],
      fields: [
        {
          key: 'item',
          label: this.$t('vt.item'),
          thClass: 'text-center col-xs-6',
        },
        {
          key: 'ducats',
          label: this.$t('currency.dabloons'),
          thClass: 'text-center col-xs-2',
        },
        {
          key: 'credits',
          label: this.$t('currency.cred'),
          thClass: 'text-center col-xs-4',
        },
      ],
    };
  },
  computed: {
    headertext() {
      return this.$t('vt.header');
    },
  },
  methods: {
    now() {
      return new Date().toString();
    },
    available() {
      return this.voidTrader.inventory.length > 0;
    },
    hereTime() {
      return dayjs(this.available() ? this.voidTrader.expiry : this.voidTrader.activation).format('llll');
    },
    locationLabel() {
      return `${this.$t(`time.${this.available() ? 'depart' : 'arrive'}`)} ${this.voidTrader.location}:`;
    },
  },
};
</script>

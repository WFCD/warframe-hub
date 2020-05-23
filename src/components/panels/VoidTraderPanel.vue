<template>
  <HubPanelWrap :title="headertext" class="baro">
    <b-list-group>
      <b-list-group-item :class="`${available() ? 'list-group-item-borderless' : 'list-group-item-borderbottom'}`">
        <span class="pull-left">{{ locationLabel() }}</span>
        <TimeBadge :starttime="voidTrader.activation" :endtime="voidTrader.expiry" :interval="1000" />
      </b-list-group-item>
      <b-list-group-item
        class="list-group-item-borderbottom"
        v-if="available()"
        :items="this.items"
        :fields="this.fields"
      >
        <b-table class="vt-table bounty-table" :items="this.items" :fields="this.fields" />
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<style>
.vt-table.table.b-table.bounty-table > tbody > tr > td {
  height: 1.25em;
}

.vt-table.table.b-table.bounty-table > thead > tr > th {
  height: 2em;
}
</style>

<script>
import moment from 'moment';

import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  name: 'VoidTraderPanel',
  props: ['voidTrader'],
  computed: {
    headertext() {
      return this.$t('vt.header');
    },
  },
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
  components: {
    HubPanelWrap,
    TimeBadge,
  },
  methods: {
    now() {
      return new Date().toString();
    },
    available() {
      return this.voidTrader.inventory.length > 0;
    },
    hereTime() {
      return moment(this.available() ? this.voidTrader.expiry : this.voidTrader.activation).format('llll');
    },
    locationLabel() {
      return `${this.$t(`time.${this.available() ? 'depart' : 'arrive'}`)} ${this.voidTrader.location}:`;
    },
  },
};
</script>

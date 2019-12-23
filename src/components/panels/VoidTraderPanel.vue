<template>
  <HubPanelWrap :title="headertext" class="baro">
    <b-list-group>
      <b-list-group-item :class="`${available() ? 'list-group-item-borderless' : 'list-group-item-borderbottom'}`">
        <span class="pull-left">{{ locationLabel() }}</span>
        <TimeBadge :starttime="voidTrader.activation" :endtime="voidTrader.expiry" :interval="1000" />
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom" v-if="available()">
        <Collapsible :headertext="`${voidTrader.character} ${$t('vt.inventory')}`">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center col-xs-6">{{ $t('vt.item') }}</th>
                <th class="text-center col-xs-2">{{ $t('currency.dabloons') }}</th>
                <th class="text-center col-xs-4">{{ $t('currency.cred') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in voidTrader.inventory" :key="`${item.item.replace(/\s/g, '').toLowerCase()}-inventory`">
                <td>{{ item.item }}</td>
                <td>{{ item.ducats }}</td>
                <td>{{ item.credits }}</td>
              </tr>
            </tbody>
          </table>
        </Collapsible>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<style scoped>
table.table td,
table.table th,
table.table > thead > tr {
  border: 0;
}
</style>

<script>
import moment from 'moment';

import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import Collapsible from '@/components/Collapsible.vue';

export default {
  name: 'VoidTraderPanel',
  props: ['voidTrader'],
  computed: {
    headertext() {
      return this.$t('vt.header');
    },
  },
  data() {
    return {};
  },
  components: {
    HubPanelWrap,
    TimeBadge,
    Collapsible,
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

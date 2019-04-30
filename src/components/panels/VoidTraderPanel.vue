<template>
  <div class=" max-w-md  h-auto rounded overflow-hidden  border-transparent">
    <div class="font-bold text-default text-4xl mt-1 bg-transparent ">
      {{ headertext }}
    </div>
    <div class="bg-bgnew  text-default  py-2">
      <div class="flex mx-1 justify-between mb-1">
        <span class="flex-1  h-6">{{ locationLabel() }}</span>
        <TimeBadge
          class=" h-6 text-sm "
          :starttime="voidTrader.activation"
          :endtime="voidTrader.expiry"
          :interval="1000"
        />
      </div>
      <!-- waiting for real data -->
      <!--
        <b-list-group-item
          :class="{
            'list-group-item-borderless': voidTrader.inventory.length > 0,
            'list-group-item-borderbottom': voidTrader.inventory.length < 1
          }"
          v-if="voidTrader.inventory.length"
        >
          <span class="pull-left">{{ hereLabel() }}</span>
          <b-badge variant="info" class="pull-right">{{
            hereTime().toLocaleString()
          }}</b-badge>
        </b-list-group-item>
        <b-list-group-item
          class="list-group-item-borderbottom"
          v-if="voidTrader.inventory.length"
        >
          <Collapsible :headertext="`${voidTrader.character} Inventory`">
            <table class="table">
              <thead>
                <tr>
                  <th class="text-center col-xs-6">Item</th>
                  <th class="text-center col-xs-2">Ducats</th>
                  <th class="text-center col-xs-4">Credits</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in voidTrader.inventory"
                  :key="
                    `${item.item.replace(/\s/g, '').toLowerCase()}-inventory`
                  "
                >
                  <td>{{ item.item }}</td>
                  <td>{{ item.ducats }}</td>
                  <td>{{ item.credits }}</td>
                </tr>
              </tbody>
            </table>
          </Collapsible>
        </b-list-group-item>-->
    </div>
  </div>
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

import HubImg from '@/components/HubImg.vue';
import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import NoDataItem from '@/components/NoDataItem.vue';
import Collapsible from '@/components/Collapsible.vue';

export default {
  name: 'VoidTraderPanel',
  props: ['voidTrader'],
  computed: {
    headertext() {
      return 'Void Trader';
    }
  },
  data() {
    return {};
  },
  components: {
    HubImg,
    HubPanelWrap,
    TimeBadge,
    NoDataItem,
    Collapsible
  },
  methods: {
    now() {
      return new Date().toString();
    },
    available() {
      return this.voidTrader.inventory.length < 1;
    },
    hereLabel() {
      return `${this.available ? 'Leaves' : 'Arrives'} at:`;
    },
    hereTime() {
      return moment(
        this.available ? this.voidTrader.expiry : this.voidTrader.activation
      ).format('llll');
    },
    locationLabel() {
      return `${this.available ? 'Departs' : 'Arrives at'} ${
        this.voidTrader.location
      }:`;
    }
  }
};
</script>

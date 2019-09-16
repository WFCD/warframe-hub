<template>
  <HubPanelWrap :title="headertext" class="sales">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom" v-if="sales.length">
        <table class="table" style="table-layout: fixed">
          <thead>
            <tr>
              <th class="text-center col-xs-2">Item</th>
              <th class="text-center col-xs-2">
                <HubImg :src="platinum" name="Platinum" />
              </th>
              <th class="text-center col-xs-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sales" :key="`${item.id}-deal`">
              <td>{{ item.item }}</td>
              <td>{{ item.premiumOverride }}</td>
              <td>
                <TimeBadge :starttime="now()" :endtime="item.expiry" :interval="10000" />
              </td>
            </tr>
          </tbody>
        </table>
      </b-list-group-item>
      <NoDataItem v-else :text="headertext" />
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
import HubImg from '@/components/HubImg.vue';
import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import NoDataItem from '@/components/NoDataItem.vue';

import platinum from '@/assets/img/general/plat.png';
export default {
  name: 'SalesPanel',
  props: ['sales'],
  computed: {
    headertext() {
      return 'Sales and Featured Deals';
    },
  },
  data() {
    return {
      platinum: platinum,
    };
  },
  components: {
    HubImg,
    HubPanelWrap,
    TimeBadge,
    NoDataItem,
  },
  methods: {
    now() {
      return new Date().toString();
    },
  },
};
</script>

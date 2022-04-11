<template>
  <HubPanelWrap :title="headertext" class="sales">
    <b-list-group>
      <b-list-group-item v-if="sales.length" class="list-group-item-borderbottom">
        <table class="table" style="table-layout: fixed">
          <thead>
            <tr>
              <th class="text-center col-xs-2">{{ $t('sales.item') }}</th>
              <th class="text-center col-xs-2">
                <HubImg :src="platinum" :name="$t('currency.plat')" />
              </th>
              <th class="text-center col-xs-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in fSales()" :key="`${item.id}-deal`">
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
import { cdn } from '@/services/utilities';

const platinum = cdn('webp/general/plat.webp');
export default {
  name: 'SalesPanel',
  components: {
    HubImg,
    HubPanelWrap,
    TimeBadge,
    NoDataItem,
  },
  props: ['sales'],
  data() {
    return {
      platinum,
    };
  },
  computed: {
    headertext() {
      return this.$t('sales.header');
    },
  },
  methods: {
    now() {
      return new Date().toString();
    },
    fSales() {
      return this.sales.filter((s) => s.premiumOverride !== 1);
    },
  },
};
</script>

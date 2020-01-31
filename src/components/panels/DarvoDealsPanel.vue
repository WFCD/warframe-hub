<template>
  <HubPanelWrap :title="headertext" class="darvo">
    <div class="compact-text" v-if="deals.length === 1">
      <b>{{ deals[0].item }}</b>
      {{ deals[0].salePrice }} <HubImg :src="platinum" :name="plat" /> ({{ deals[0].discount }}{{ off }})
      {{ deals[0].total - deals[0].sold }}/{{ deals[0].total }} {{ $t('darvo.leftL') }}
      <TimeBadge :starttime="now()" :endtime="deals[0].expiry" :interval="10000" />
    </div>
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom" v-if="deals.length">
        <table class="table p-0 m-0" style="table-layout: fixed">
          <tbody>
            <tr v-for="item in deals" :key="`${item.id}-deal`">
              <td>{{ item.item }}</td>
              <td>{{ item.discount }}{{ $t('darvo.off') }}</td>
              <td>{{ item.salePrice }} <HubImg :src="platinum" :name="$t('currency.plat')" /></td>
              <td>{{ (((item.total - item.sold) / item.total) * 100).toFixed(2) }}{{ $t('darvo.left') }}</td>
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
  name: 'DarvoDealsPanel',
  props: ['deals'],
  computed: {
    headertext() {
      return this.$t('darvo.header');
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

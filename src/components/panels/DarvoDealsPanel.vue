<template>
  <div class=" max-w-md  h-auto rounded overflow-hidden  border-transparent">
    <div class="font-bold text-default text-4xl mt-1">
      {{ headertext }}
    </div>
    <div class="bg-bgnew  text-default  py-2">
      <div v-if="deals.length">
        <div class="flex mx-1 items-center">
          <div class="w-1/5 bg-bgnew h-auto">Item</div>
          <div class="w-1/6 bg-bgnew h-auto">% off</div>
          <div class="w-1/6 bg-bgnew h-auto">
            <HubImg :src="platinum" name="Platinum" />
          </div>
          <div class="w-1/5 bg-bgnew h-auto">Stock</div>

          <div class="w-1/5 bg-bgnew h-auto"></div>
        </div>

        <div v-for="item in deals" :key="`${item.id}-deal`" class="flex mx-1  ">
          <div class="w-1/5 bg-bgnew h-6">{{ item.item }}</div>
          <div class="w-1/6 bg-bgnew h-6">{{ item.discount }}%</div>
          <div class="w-1/6 bg-bgnew h-6">{{ item.salePrice }}</div>
          <div class="w-1/5 bg-bgnew h-6">
            {{ (((item.total - item.sold) / item.total) * 100).toFixed(2) }}%
          </div>
          <TimeBadge
            class="flex  h-6 text-sm "
            :starttime="now2"
            :endtime="item.expiry"
            :interval="1000"
          />
        </div>
      </div>
      <NoDataItem v-else :text="headertext" />
    </div>
  </div>
</template>

<style scoped>
table.table div,
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
      return "Darvo's Deals";
    },
    now2() {
      return new Date().toISOString();
    }
  },
  data() {
    return {
      platinum: platinum
    };
  },
  components: {
    HubImg,
    HubPanelWrap,
    TimeBadge,
    NoDataItem
  },
  methods: {
    now() {
      return new Date().toString();
    }
  }
};
</script>

<template>
  <b-list-group-item class="py-1" :class="{ 'list-group-item-borderbottom': !overrideBorder }">
    <span class="dim">
      <HubImg
        :src="loading"
        :name="$t('nav.nodata')"
        width="40px"
        height="40px"
        style="filter: invert(80%); padding-right: 10px"
      />
      <div class="no-content-warning align-middle" style="margin-bottom: 2px">
        {{ $t('nav.nodatatxt', { text }) }}
      </div>
    </span>
  </b-list-group-item>
</template>

<script>
import HubImg from '@/components/HubImg.vue';
import { cdn } from '@/services/utilities';

const loading = cdn('svg/loading.svg');
export default {
  name: 'NoDataItem',
  components: {
    HubImg,
  },
  props: ['text', 'overrideBorder'],
  data() {
    return {
      loading,
    };
  },
};
</script>

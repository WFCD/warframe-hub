<template>
  <b-list-group-item class="list-group-item-borderbottom py-1">
    <span class="dim">
      <HubImg
        :src="loading"
        name="No Data"
        width="40px"
        height="40px"
        style="filter: invert(80%); padding-right:10px;"
      />
      <div class="no-content-warning align-middle" style="margin-bottom:2px;">No {{ text }} Present</div>
    </span>
  </b-list-group-item>
</template>

<script>
import HubImg from '@/components/HubImg.vue';

import loading from '@/assets/img/general/loading.svg';
export default {
  name: 'NoDataItem',
  props: ['text'],
  data() {
    return {
      loading: loading,
    };
  },
  components: {
    HubImg,
  },
};
</script>

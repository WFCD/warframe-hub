<template>
  <div>
    <b-btn variant="primary" v-b-toggle="`${headertext.replace(/\s/ig, '-').toLowerCase()}-collapsible`">
      {{headertext}} <i class="fas fa-chevron-down"></i>
    </b-btn>
    <b-collapse :id="`${headertext.replace(/\s/ig, '-').toLowerCase()}-collapsible`" @hidden="reflow()" @shown="reflow()">
      <b-card>
        <slot></slot>
      </b-card>
    </b-collapse>
  </div>
</template>
<script>
  import {packeryEvents} from 'vue-packery-plugin'

  import TimeBadge from '@/components/TimeBadge.vue';
  import NoDataItem from '@/components/NoDataItem.vue';
  import HubImg from '@/components/HubImg.vue';
  import HubPanelWrap from '@/components/HubPanelWrap';
  import Collapsible from '@/components/Collapsible';

  import standing from '@/assets/img/general/standing.svg';

  export default {
    name: 'Collapsible',
    props: ['headertext'],
    methods: {
      reflow: function() {
        console.log('triggered reflow');
        packeryEvents.$emit('layout', this.$refs.timerComponentGrid);
      }
    },
  };
</script>

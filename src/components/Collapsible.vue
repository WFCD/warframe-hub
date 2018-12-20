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
  import {packeryEvents} from 'vue-packery-plugin';
  import Collapsible from '@/components/Collapsible';

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

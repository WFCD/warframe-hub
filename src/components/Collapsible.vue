<template>
  <div>
    <b-btn variant="primary" v-b-toggle="`collapsible-${this.cid}`" style="margin-bottom: 4px;">
      {{ headertext }} <i class="fas fa-chevron-down"></i>
    </b-btn>
    <b-collapse :id="`collapsible-${this.cid}`" @hidden="reflow()" @shown="reflow()">
      <b-card>
        <slot></slot>
      </b-card>
    </b-collapse>
  </div>
</template>
<script>
import util from '@/utilities';

export default {
  name: 'Collapsible',
  props: ['headertext'],
  data: function() {
    return {
      id: 0,
    };
  },
  methods: {
    reflow: function() {
      // eslint-disable-next-line no-console
      console.error('triggered reflow --- this does nothing, needs to trigger the resize for the grid item');
    },
    makeid: function() {
      return util.makeid();
    },
  },
  computed: {
    cid: function() {
      if (this.id) {
        return this.id;
      } else {
        this.id = this.makeid(); // eslint-disable-line vue/no-side-effects-in-computed-properties
      }
      return this.id;
    },
  },
};
</script>

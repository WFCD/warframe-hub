<template>
  <div>
    <b-btn v-b-toggle="`collapsible-${cid}`" variant="primary" style="margin-bottom: 4px">
      {{ headertext }} <i class="fas fa-chevron-down"></i>
    </b-btn>
    <b-collapse :id="`collapsible-${cid}`" @hidden="reflow()" @shown="reflow()">
      <b-card>
        <slot></slot>
      </b-card>
    </b-collapse>
  </div>
</template>
<script>
import util from '@/services/utilities';

export default {
  name: 'CollapsiblePanel',
  props: ['headertext'],
  data() {
    return {
      id: 0,
    };
  },
  computed: {
    cid() {
      if (this.id) {
        return this.id;
      } else {
        this.id = this.makeid(); // eslint-disable-line vue/no-side-effects-in-computed-properties
      }
      return this.id;
    },
  },
  methods: {
    reflow() {
      // eslint-disable-next-line no-console
      console.error('triggered reflow --- this does nothing, needs to trigger the resize for the grid item');
    },
    makeid() {
      return util.makeid();
    },
  },
};
</script>

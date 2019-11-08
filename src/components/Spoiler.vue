<template>
  <div>
    <b-collapse
      :id="`spoiler-${this.cid}`"
      @hidden="
        toggled();
        downArrow();
      "
      @shown="
        toggled();
        upArrow();
      "
      v-bind:visible="init"
    >
      <slot></slot>
    </b-collapse>
    <b-btn variant="primary" v-b-toggle="`spoiler-${this.cid}`" class="mb-1 py-0">
      {{ headertext }} <i :class="this.initialArrow" ref="arrow"></i>
    </b-btn>
  </div>
</template>
<script>
import util from '@/utilities';

export default {
  name: 'Collapsible',
  props: ['headertext', 'init'],
  data: function() {
    return {
      id: 0,
    };
  },
  methods: {
    toggled: function() {
      this.$emit('toggle');
    },
    makeid: function() {
      return util.makeid();
    },
    upArrow: function() {
      this.$refs.arrow.className = 'fas fa-chevron-up';
    },
    downArrow: function() {
      this.$refs.arrow.className = 'fas fa-chevron-down';
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
    initialArrow: function() {
      if (this.init) {
        return 'fas fa-chevron-up';
      }
      return 'fas fa-chevron-down';
    },
  },
};
</script>

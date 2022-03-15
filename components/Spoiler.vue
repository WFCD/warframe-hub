<template>
  <div>
    <b-collapse
      :id="`spoiler-${cid}`"
      :visible="init"
      @hidden="
        toggled();
        downArrow();
      "
      @shown="
        toggled();
        upArrow();
      "
    >
      <slot></slot>
    </b-collapse>
    <b-btn v-b-toggle="`spoiler-${cid}`" variant="primary" class="mb-1 py-0">
      {{ headertext }} <i ref="arrow" :class="initialArrow"></i>
    </b-btn>
  </div>
</template>
<script>
import util from '@/services/utilities';

export default {
  name: 'SpoilerComponent',
  props: ['headertext', 'init'],
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
    initialArrow() {
      if (this.init) {
        return 'fas fa-chevron-up';
      }
      return 'fas fa-chevron-down';
    },
  },
  methods: {
    toggled() {
      this.$emit('toggle');
    },
    makeid() {
      return util.makeid();
    },
    upArrow() {
      this.$refs.arrow.className = 'fas fa-chevron-up';
    },
    downArrow() {
      this.$refs.arrow.className = 'fas fa-chevron-down';
    },
  },
};
</script>

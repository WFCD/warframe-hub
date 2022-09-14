<template>
  <div>
    <b-collapse
      :id="`spoiler-${id}`"
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
    <b-btn v-b-toggle="`spoiler-${id}`" variant="primary" class="mb-1 py-0">
      {{ headertext }} <i ref="arrow" :class="initialArrow"></i>
    </b-btn>
  </div>
</template>
<script>
import { makeid } from '@/services/utilities';

export default {
  name: 'SpoilerComponent',
  props: {
    headertext: {
      type: String,
      default: () => '',
    },
    init: {
      type: Boolean,
      default: () => false,
    },
    toggle: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
  },
  data() {
    return {
      id: makeid(),
    };
  },
  computed: {
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
    upArrow() {
      this.$refs.arrow.className = 'fas fa-chevron-up';
    },
    downArrow() {
      this.$refs.arrow.className = 'fas fa-chevron-down';
    },
  },
};
</script>

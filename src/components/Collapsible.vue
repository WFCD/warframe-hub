<template>
  <span>
    <b-btn variant="primary" v-b-toggle="`collapsible-${this.cid}`" size="sm" class="pull-right xs">
      <i class="fas fa-xs fa-chevron-down open"></i>
      <i class="fas fa-xs fa-chevron-left closed"></i>
    </b-btn>
    <b-collapse :id="`collapsible-${this.cid}`" @hidden="reflow()" @shown="reflow()">
      <b-card>
        <slot></slot>
      </b-card>
    </b-collapse>
  </span>
</template>
<style>
.collapsed > .open,
:not(.collapsed) > .closed {
  display: none;
}

button + div.collapse {
  margin-top: 25px;
}

button.btn.xs,
button.btn.xs > * {
  line-height: 0.75em;
  padding-top: 0.12rem;
}
</style>
<script>
import util from '@/utilities';

export default {
  name: 'Collapsible',
  props: ['headertext', 'bClass'],
  data: function() {
    return {
      id: 0,
    };
  },
  methods: {
    reflow: function() {},
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

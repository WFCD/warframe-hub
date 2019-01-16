<template>
  <grid-item :x="grid.x"
             :y="grid.y"
             :w="grid.w"
             :h="grid.h"
             :i="grid.i">
    <h3 class="text-center">{{title}}</h3>
    <slot></slot>
  </grid-item>
</template>

<script>
export default {
  name: 'HubPanelWrap',
  props: [
    'title',
    'grid'
  ],
  data () { return { }; },
  components: {}
};
</script>

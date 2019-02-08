<template>
  <div class="">
    <h3 class="text-center">{{title}}</h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HubPanelWrap',
  props: [
    'title'
  ],
  data () { return { }; },
  components: {}
};
</script>

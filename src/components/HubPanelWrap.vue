<template>
  <b-col md="6" v-packery-item class="panel-header packery-item">
    <h3 class="text-center dragger">{{title}}</h3>
    <slot></slot>
  </b-col>
</template>

<script>
export default {
  name: 'HubPanelWrap',
  props: ['title'],
  data () { return { }; },
  components: {}
};
</script>

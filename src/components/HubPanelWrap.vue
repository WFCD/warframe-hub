<template>
  <b-col md="4" data-packer-item="true" class="panel-header packery-item mt-2" style="padding-top: 10px">
    <h4 class="text-center header-panel">{{ title }}</h4>
    <slot></slot>
  </b-col>
</template>

<script>
export default {
  name: 'HubPanelWrap',
  props: ['title'],
  data() {
    return {};
  },
  components: {},
};
</script>

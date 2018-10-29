<template>
  <img
    :src="src"
    :name="name"
    :height="height"
    :width="width"
    :alt="name"
  />
</template>


<script>
export default {
  name: 'HubImg',
  props: {
    src: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'Name'
    },
    width: {
      type: String,
      default: '12px',
    },
    height: {
      type: String,
      default: '12px',
    }
  }
};
</script>

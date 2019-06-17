<template>
  <span>
    <b-dd-item v-if="isLocal" :to="target" exact>
      <i :class="`${icon} faIcon`"></i>
      {{ label }}
    </b-dd-item>
    <b-dd-item :href="target" rel="noopener" target="_blank" v-else>
      <i :class="`${icon} faIcon`"></i>
      {{ label }}
    </b-dd-item>
  </span>
</template>

<style scoped>
.b-nav-dropdown .dropdown-menu .dropdown-item i,
.b-nav-dropdown .dropdown-menu .dropdown-header i {
  margin-top: 3px;
  margin-right: 10px;
  width: 1em;
  text-align: center;
}
</style>

<script>
export default {
  name: 'DropdownItem',
  props: ['isLocal', 'target', 'label', 'icon'],
  data() {
    return {};
  },
};
</script>

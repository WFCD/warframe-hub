<template>
  <span>
    <b-dd-item v-if="isLocal" :to="target" exact v-b-tooltip.bottom :title="(!labelIfMobile && !$isMobile()) ? label : ''">
      <i :class="`${icon} faIcon`"></i>
      {{ labelIfMobile ? ( $isMobile() ? label : '') : label }}
    </b-dd-item>
    <b-dd-item :href="target" rel="noopener" target="_blank"  v-b-tooltip.bottom :title="(labelIfMobile && !isMobile) ? label : ''" v-else>
      <i :class="`${icon} faIcon`"></i>
      {{ labelIfMobile ? ( $isMobile() ? label : '') : label }}
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
  props: {
    'isLocal': {
      type: Boolean,
      default: false,
    },
    'target': {
      type: String,
      default: '#',
    },
    'label': {
      type: String,
      default: '',
    },
    'icon': {
      type: String,
      default: 'fas fa-external-link-alt'
    },
    'labelIfMobile': {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return { };
  },
};
</script>

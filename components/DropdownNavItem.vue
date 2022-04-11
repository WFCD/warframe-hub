<template>
  <span>
    <b-dd-item v-if="isLocal && !labelIfMobile && !$device.isMobileOrTablet" :to="target" exact>
      <i :class="`${icon} faIcon`"></i>
      {{ label }}
    </b-dd-item>
    <b-dd-item v-if="isLocal && !labelIfMobile && $device.isMobileOrTablet" :to="target" exact>
      <i :class="`${icon} faIcon`"></i>
      {{ label }}
    </b-dd-item>
    <b-dd-item v-if="isLocal && labelIfMobile && !$device.isMobileOrTablet" :to="target" exact>
      <i :class="`${icon} faIcon`"></i>
      {{ label }}
    </b-dd-item>
    <b-dd-item
      v-else-if="!isLocal"
      v-b-tooltip.bottom
      :href="target"
      rel="noopener"
      target="_blank"
      :title="labelIfMobile && !$device.isMobileOrTablet ? label : ''"
    >
      <i :class="`${icon} faIcon`"></i>
      {{ labelIfMobile ? ($device.isMobileOrTablet ? label : '') : label }}
    </b-dd-item>
  </span>
</template>

<script>
export default {
  name: 'DropdownItem',
  props: {
    isLocal: {
      type: Boolean,
      default: false,
    },
    target: {
      type: String,
      default: '#',
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'fas fa-external-link-alt',
    },
    labelIfMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.b-nav-dropdown .dropdown-menu .dropdown-item i,
.b-nav-dropdown .dropdown-menu .dropdown-header i {
  margin-top: 3px;
  margin-right: 10px;
  width: 1em;
  text-align: center;
}
</style>

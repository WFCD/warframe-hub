<template>
  <span>
    <b-dropdown-item v-if="isLocal">
      <router-link :to="target" class="navItemParent" exact>
        <i :class="`${icon} faIconStyle`"></i>
        <span class="navItemLabel">{{label}}</span>
      </router-link>
    </b-dropdown-item>
    <b-dropdown-item v-else>
        <a :href="target" rel="noopener" target="_blank" class="navItemParent">
          <i :class="`${icon} faIconStyle`"></i>
          <span class="navItemLabel">{{label}}</span>
        </a>
    </b-dropdown-item>
  </span>
</template>

<style>
  .faIconStyle {
    margin-top: 3px;
    margin-left: 10px;
    margin-right: 10px;
    width: 1em;
  }

  .navItemLabel {
    flex-grow: 1;
  }

  .navItemParent, .dropdown-item.navItemParent {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    text-align: center;
  }
</style>

<script>
  export default {
    name: 'DropdownItem',
    props: ['isLocal', 'target', 'label', 'icon'],
    data() { return {}; },
  };
</script>

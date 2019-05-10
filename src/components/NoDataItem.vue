<template>
  <b-list-group-item class="list-group-item-borderbottom">
    <span class="dim">
      <i class="fas fa-exclamation-triangle faIcon fa-3x"></i>
      <div class="no-content-warning">
        No {{text}} Present
      </div>
    </span>
  </b-list-group-item>
</template>

<script>
export default {
  name: 'NoDataItem',
  props: ['text'],
};
</script>

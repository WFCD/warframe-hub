<template>
  <div>
    <div>
      Oddity Set - <i>{{ set }}</i>
    </div>
    <div>
      Fragment Name: <b>{{ name }}</b>
    </div>
    <iframe :src="video" width="320" height="180" style="margin-right:20px" frameborder="0" allowfullscreen></iframe>
  </div>
</template>

<script>
/*
  From  https://github.com/KoRiGaN/Vue2Leaflet/blob/master/examples/src/components/GeoJson2Popup.vue
*/
export default {
  name: 'OddityPopup',
  props: {
    type: {
      type: String,
      default: '',
    },
    set: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    video: {
      type: String,
      default: '',
    },
  },
};
</script>

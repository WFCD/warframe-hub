<template>
  <div id="plains-of-eidolon-m"></div>
</template>

<style>
  #plains-of-eidolon-m {
    height: 600px;
    weight: 400px;
  }
</style>

<script>
  /* map stuff */
  import L from 'leaflet';
  import plains from '@/assets/img/poe.jpg';

  export default {
    name: 'Poemap',
    data() {
      return {};
    },
    mounted: function () {
      const map = L.map('plains-of-eidolon-m', {
        crs: L.CRS.Simple
      });

      const bounds = [[0,0], [1000,1000]];
      const image = L.imageOverlay(plains, bounds).addTo(map);

      map.fitBounds(bounds);
      map.setView( [500,500], 1);
    },
  };
</script>

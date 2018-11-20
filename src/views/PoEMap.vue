<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <div id="plains-of-eidolon-m"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<style>
  #plains-of-eidolon-m {
    height: calc(100vh - 100px);
    width: 100%;
  }
</style>

<script>
  /* map stuff */
  import L from 'leaflet';
  import plains from '@/assets/img/plains.png';

  export default {
    name: 'Poemap',
    data() {
      return {};
    },
    methods: {
      track () {
        this.$ga.page('/poe/map');
      }
    },
    mounted: function () {
      const map = L.map('plains-of-eidolon-m', {
        crs: L.CRS.Simple,
        zoomControl: true,
        attributionControl: false,
      });

      const bounds = [[0,0], [1012, 994]];
      L.imageOverlay(plains, bounds).addTo(map);

      map.on('click', function(e){
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        // eslint-disable-next-line
        console.log(`Clicked (${lat},${lng},${map.getZoom()})`);
      });
      map.fitBounds(bounds);
      map.setView( [472, 535], 0);
    },
  };
</script>

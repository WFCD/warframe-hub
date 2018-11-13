<template>
  <div id="orb-vallis-m"></div>
</template>

<style>
  #orb-vallis-m {
    height: calc(100vh - 100px);
    width: 400px;
  }
</style>

<script>
  /* map stuff */
  import L from 'leaflet';
  import vallis from '@/assets/img/orbvallis.png';

  import fishMap from '@/assets/img/map_icons/fish.png';

  const fishIcon = L.icon({
    iconUrl: '@/assets/img/map_icons/fish.png',
  });

  export default {
    name: 'Poemap',
    data() {
      return {};
    },
    mounted: function () {
      const map = L.map('orb-vallis-m', {
        crs: L.CRS.Simple,
        zoomControl: true,
        attributionControl: false,
        minZoom: -10,
      });

      const bounds = [[0,0], [2150,2153]];
      const image = L.imageOverlay(vallis, bounds).addTo(map);

      map.on('click', function(e){
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        console.log(`Clicked (${lat},${lng},${map.getZoom()})`);
      });
      map.fitBounds(bounds);
      map.setView( [942,1060], -1);

      L.marker([1154,768], {title: 'Helena\'s Fishing Spot', icon: { fishIcon }}).addTo(map);
    },
  };
</script>

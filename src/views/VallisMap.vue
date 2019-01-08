<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <l-map
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            :crs="crs"
            :style="mapStyle"
          >
          <l-image-overlay :url="url" :bounds="bounds"/>
        </l-map>
      </b-col>
    </b-row>
  </b-container>
</template>

<style>
  #orb-vallis-m {
    height: calc(100vh - 100px);
    width: 100%;
  }
</style>

<script>
  import vallis from '@/assets/img/orbvallis.png';

  import { LMap, LImageOverlay, LMarker, LPopup, LPolyline, LGeoJson } from 'vue2-leaflet';

  const fishIcon = L.icon({
    iconUrl: '@/assets/img/map_icons/fish.png',
  });

  export default {
    name: 'Poemap',
    data() {
      return {
        zoom: -1,
        center: L.latLng(942,1060),
        url: vallis,
        bounds: [[0,0], [2150,2153]],
        mapOptions: {
          zoomSnap: 0.5,
          minZoom: -10,
          attributionControl: false,
        },
        crs: L.CRS.Simple,
        mapStyle: {
          height: 'calc(100vh - 100px)',
          width: '100%',
        },
        geo: {}
      };
    },
    components: {
      LMap,
      LImageOverlay,
      LMarker,
      LPopup,
      LPolyline,
      LGeoJson,
    },
    methods: {
      track () {
        this.$ga.page('/vallis/map');
      },
    },
    mounted: function () {
      // L.marker([1154,768], {title: 'Helena\'s Fishing Spot', icon: { fishIcon }}).addTo(map);
    },
  };
</script>

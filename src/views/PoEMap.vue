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
          <l-geo-json :geojson="geo.fish" />
          <l-geo-json :geojson="geo.grineer" />
          <l-geo-json :geojson="geo.lorefish" />
          <l-geo-json :geojson="geo.wisp" />
        </l-map>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  /* map stuff */
  import plains from '@/assets/img/plains.png';
  import fish from '@/assets/json/geo/fishing.json';
  import grineer from '@/assets/json/geo/grineer.json';
  import lorefish from '@/assets/json/geo/lorefish.json';
  import wisp from '@/assets/json/geo/wisp.json';

  import { LMap, LImageOverlay, LMarker, LPopup, LPolyline, LGeoJson } from 'vue2-leaflet';

  export default {
    name: 'Poemap',
    data() {
      return {
        zoom: 0,
        center: L.latLng(472, 535),
        url: plains,
        bounds: [[0,0], [994, 1012]],
        currentZoom: 11.5,
        currentCenter: L.latLng(472, 535),
        mapOptions: {
          zoomSnap: 0.5,
          attributionControl: false,
        },
        crs: L.CRS.Simple,
        mapStyle: {
          height: 'calc(100vh - 100px)',
          width: '100%',
        },
        geo: {
          fish,
          grineer,
          lorefish,
          wisp,
        }
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
        this.$ga.page('/poe/map');
      },
    },
    mounted: function () {},
  };
</script>

<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <l-map
            ref="v-map"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            :crs="crs"
            :style="mapStyle"
            @click="checkLatLng"
          >
          <l-image-overlay :url="url" :bounds="bounds"/>

          <l-marker ></l-marker>
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
  import Vue from 'vue';
  import MapPopup from '@/components/MapPopup.vue';
  import vallis from '@/assets/img/orbvallis.png';

  function onEachFeature (feature, layer) {
    let Popup = Vue.extend(MapPopup);
    let popup = new Popup({ propsData: { type: feature.geometry.type, text: feature.properties.popupContent } });
    layer.bindPopup(popup.$mount().$el);
  }

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
        geo: {},
        geoOpts: {
          onEachFeature: onEachFeature
        },
      };
    },
    methods: {
      track () {
        this.$ga.page('/vallis/map');
      },
      checkLatLng(e) {
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        // eslint-disable-next-line
        console.log(`Clicked (${lat},${lng}})`);
      },
    },
    mounted: function () {
      // L.marker([1154,768], {title: 'Helena\'s Fishing Spot', icon: { }}).addTo(this.$refs['v-map'])
      // L.marker([1154,768], {title: 'Helena\'s Fishing Spot', icon: { fishIcon }}).addTo(map);
    },
  };
</script>

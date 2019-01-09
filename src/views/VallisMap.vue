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
          <l-control-layers
            :position="'topright'"
            :collapsed="false"
            :sort-layers="true"
          />
          <l-layer-group
          v-for="geojson in geo"
            layer-type="overlay"
            :key="geojson.name"
            :name="geojson.name"
          >
            <l-geo-json :geojson="geojson.json" :options="geojson.opts"/>
          </l-layer-group>

          <l-marker :lat-lng="markers.vallis.loc">
            <l-icon
              :icon-size="icons.home.size"
              :icon-url="icons.home.src" >
            </l-icon>
            <l-tooltip :options="{permanent: false, interactive: true, position: markers.vallis.position}">
              <div>{{markers.vallis.title}}</div>
            </l-tooltip>
          </l-marker>
        </l-map>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Vue from 'vue';
  import {L} from 'vue2-leaflet';

  /* map stuff */
  import vallis from '@/assets/img/orbvallis.png';
  import fish from '@/assets/json/geo/vallis/fishing.json';
  import fishIcon from '@/assets/img/map_icons/fish.png';
  import homeIcon from '@/assets/img/map_icons/home.png';

  import MapPopup from '@/components/MapPopup.vue';

  const fishMarker = L.icon({
    iconUrl: fishIcon,
    iconSize: [25, 25],
  });

  function onEachFeature (feature, layer) {
    let Popup = Vue.extend(MapPopup);
    let popup = new Popup({
      propsData: {
        type: feature.geometry.type,
        text: feature.properties.name
      }
    });
    layer.bindPopup(popup.$mount().$el);
  }

  const markerAlias = L.marker;

  export default {
    name: 'Vallismap',
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
        geo: [
          {
            name: 'Fishing',
            json: fish,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: fishMarker});
              },
              onEachFeature: onEachFeature
            }
          }
        ],
        icons: {
          home: {
            src: homeIcon,
            size: [25, 25],
          }
        },
        markers: {
          vallis: {
            loc: L.latLng(900.25,1067.33),
            title: 'Fortuna',
            position: 'bottom'
          },
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
        console.log(`Clicked (${lat.toFixed(2)},${lng.toFixed(2)})`);
      },
    },
    mounted: function () {},
  };
</script>

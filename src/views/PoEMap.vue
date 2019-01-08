<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <l-map
            ref="p-map"
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

          <l-marker :lat-lng="markers.cetus.loc">
            <l-icon
              :icon-size="icons.home.size"
              :icon-url="icons.home.src" >
            </l-icon>
            <l-tooltip :options="{permanent: false, interactive: true, position: markers.cetus.position}">
              <div>{{markers.cetus.title}}</div>
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
  import plains from '@/assets/img/plains.png';
  import fish from '@/assets/json/geo/fishing.json';
  import grineer from '@/assets/json/geo/grineer.json';
  import lorefish from '@/assets/json/geo/lorefish.json';
  import wisp from '@/assets/json/geo/wisp.json';
  import lure from '@/assets/json/geo/lure.json';
  import cave from '@/assets/json/geo/cave.json';
  import fishIcon from '@/assets/img/map_icons/fish.png';
  import grineerIcon from '@/assets/img/map_icons/grineer.png';
  import oddityIcon from '@/assets/img/map_icons/oddity.png';
  import homeIcon from '@/assets/img/map_icons/home.png';
  import wispIcon from '@/assets/img/map_icons/wisp.png';
  import lureIcon from '@/assets/img/map_icons/lure.png';
  import caveIcon from '@/assets/img/map_icons/caves.png';

  import MapPopup from '@/components/MapPopup.vue';
  import OddityPopup from '@/components/OddityPopup.vue';

  const fishMarker = L.icon({
    iconUrl: fishIcon,
    iconSize: [25, 25],
  });

  const grineerMarker = L.icon({
    iconUrl: grineerIcon,
    iconSize: [25, 25],
  });

  const oddityMarker = L.icon({
    iconUrl: oddityIcon,
    iconSize: [25, 25],
  });

  const wispMarker = L.icon({
    iconUrl: wispIcon,
    iconSize: [25, 25],
  });

  const lureMarker = L.icon({
    iconUrl: lureIcon,
    iconSize: [25, 25],
  });

  const caveMarker = L.icon({
    iconUrl: caveIcon,
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

  function onEachOddity (feature, layer) {
    let Popup = Vue.extend(OddityPopup);
    let popup = new Popup({
      propsData: {
        type: feature.geometry.type,
        name: feature.properties.name,
        video: feature.properties.video
      }
    });
    layer.bindPopup(popup.$mount().$el, { minWidth: 320});
  }

  const markerAlias = L.marker;

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
          },
          {
            name: 'Grineer Camp',
            json: grineer,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: grineerMarker});
              },
              onEachFeature: onEachFeature
            }
          },
          {
            name: 'Oddity',
            json: lorefish,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: oddityMarker});
              },
              onEachFeature: onEachOddity
            }
          },
          {
            name: 'Wisp Spawn',
            json: wisp,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: wispMarker});
              },
              onEachFeature: onEachFeature
            }
          },
          {
            name: 'Lure Locations',
            json: lure,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: lureMarker});
              },
              onEachFeature: onEachFeature
            }
          },
          {
            name: 'Cave Entrances',
            json: cave,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: caveMarker});
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
          cetus: {
            loc: L.latLng(173.77,535.09),
            title: 'Cetus',
            position: 'bottom'
          },
        },
      };
    },
    methods: {
      track () {
        this.$ga.page('/poe/map');
      },
      checkLatLng(e){
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

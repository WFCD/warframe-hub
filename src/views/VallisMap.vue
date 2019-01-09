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

          <l-layer-group
            layer-type="overlay"
            key="Special Caves"
            name="Special Caves"
          >
            <l-marker :lat-lng="caves.fishcave.loc">
              <l-icon
                :icon-size="icons.fishcave.size"
                :icon-url="icons.fishcave.src" >
              </l-icon>
              <l-tooltip :options="{permanent: false, interactive: true, position: caves.fishcave.position}">
                <div>{{caves.fishcave.title}}</div>
              </l-tooltip>
            </l-marker>
            <l-geo-json :geojson="caves.toroidfishcave.json" :options="caves.toroidfishcave.opts"/>
            <l-geo-json :geojson="caves.toroidcave.json" :options="caves.toroidcave.opts"/>
          </l-layer-group>

          <l-layer-group
            layer-type="overlay"
            key="Toroids"
            name="Toroids"
          >
            <l-marker :lat-lng="markers.calda.loc">
              <l-icon
                :icon-size="icons.calda.size"
                :icon-url="icons.calda.src" >
              </l-icon>
              <l-tooltip :options="{permanent: false, interactive: true, position: markers.calda.position}">
                <div>{{markers.calda.title}}</div>
              </l-tooltip>
            </l-marker>
            <l-marker :lat-lng="markers.sola.loc">
              <l-icon
                :icon-size="icons.sola.size"
                :icon-url="icons.sola.src" >
              </l-icon>
              <l-tooltip :options="{permanent: false, interactive: true, position: markers.sola.position}">
                <div>{{markers.sola.title}}</div>
              </l-tooltip>
            </l-marker>
            <l-marker :lat-lng="markers.vega.loc">
              <l-icon
                :icon-size="icons.vega.size"
                :icon-url="icons.vega.src" >
              </l-icon>
              <l-tooltip :options="{permanent: false, interactive: true, position: markers.vega.position}">
                <div>{{markers.vega.title}}</div>
              </l-tooltip>
            </l-marker>
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
  import fishRecommend from '@/assets/json/geo/vallis/fishing-recommend.json';
  import mineRecommend from '@/assets/json/geo/vallis/mining-recommend.json';
  import toroidFishCave from '@/assets/json/geo/vallis/toroidfishcave.json';
  import toroidCave from '@/assets/json/geo/vallis/toroidcave.json';
  import kdrive from '@/assets/json/geo/vallis/kdrive.json';
  import fishIcon from '@/assets/img/map_icons/fish.png';
  import fishRecommendIcon from '@/assets/img/map_icons/fish-recommend.png';
  import mineRecommendIcon from '@/assets/img/map_icons/mine-recommend.png';
  import fishCaveIcon from '@/assets/img/map_icons/fishing-cave.png';
  import fishToroidCaveIcon from '@/assets/img/map_icons/toroid-fishing-cave.png';
  import toroidCaveIcon from '@/assets/img/map_icons/toroid-normal-cave.png';
  import homeIcon from '@/assets/img/map_icons/home.png';
  import caldaIcon from '@/assets/img/map_icons/calda-toroid.png';
  import solaIcon from '@/assets/img/map_icons/sola-toroid.png';
  import vegaIcon from '@/assets/img/map_icons/vega-toroid.png';
  import kdriveIcon from '@/assets/img/map_icons/kdrive.png';

  import MapPopup from '@/components/MapPopup.vue';

  const fishMarker = L.icon({
    iconUrl: fishIcon,
    iconSize: [25, 25],
  });

  const fishRecommendMarker = L.icon({
    iconUrl: fishRecommendIcon,
    iconSize: [50, 34],
  });

  const mineRecommendMarker = L.icon({
    iconUrl: mineRecommendIcon,
    iconSize: [50, 34],
  });

  const fishToroidCaveMarker = L.icon({
    iconUrl: fishToroidCaveIcon,
    iconSize: [50, 34],
  });

  const toroidCaveMarker = L.icon({
    iconUrl: toroidCaveIcon,
    iconSize: [50, 34],
  });

  const kdriveMarker = L.icon({
    iconUrl: kdriveIcon,
    iconSize: [50, 34],
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
          },
          {
            name: 'Fishing Spots',
            json: fishRecommend,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: fishRecommendMarker});
              },
              onEachFeature: onEachFeature
            }
          },
          {
            name: 'Mining Spots',
            json: mineRecommend,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: mineRecommendMarker});
              },
              onEachFeature: onEachFeature
            }
          },
          {
            name: 'K-Drive',
            json: kdrive,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: kdriveMarker});
              },
              onEachFeature: onEachFeature
            }
          }
        ],
        caves: {
          fishcave: {
            loc: L.latLng(1895.73,1480.74),
            title: 'Fishing Cave',
            position: 'bottom'
          },
          toroidfishcave: {
            json: toroidFishCave,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: fishToroidCaveMarker});
              },
              onEachFeature: onEachFeature
            }
          },
          toroidcave: {
            json: toroidCave,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: toroidCaveMarker});
              },
              onEachFeature: onEachFeature
            }
          }
        },
        icons: {
          home: {
            src: homeIcon,
            size: [25, 25],
          },
          calda: {
            src: caldaIcon,
            size: [90, 62],
          },
          sola: {
            src: solaIcon,
            size: [90, 62],
          },
          vega: {
            src: vegaIcon,
            size: [90, 62],
          },
          fishcave: {
            src: fishCaveIcon,
            size: [50, 34],
          }
        },
        markers: {
          vallis: {
            loc: L.latLng(900.25,1067.33),
            title: 'Fortuna',
            position: 'bottom'
          },
          calda: {
            loc: L.latLng(642.88,688.49),
            title: 'Calda Toroid',
            position: 'bottom'
          },
          sola: {
            loc: L.latLng(1871.63,550.59),
            title: 'Sola Toroid',
            position: 'bottom'
          },
          vega: {
            loc: L.latLng(440.62,1455.98),
            title: 'Vega Toroid',
            position: 'bottom'
          }
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

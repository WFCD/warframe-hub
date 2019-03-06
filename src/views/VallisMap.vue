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
          >
          <l-control-layers
            :position="'topright'"
            :collapsed="false"
            :sort-layers="true"
          />
          <l-image-overlay
            :url="url"
            :bounds="bounds"
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
  import labels from '@/assets/json/geo/vallis/labels.json';
  import fishRecommend from '@/assets/json/geo/vallis/fishing-recommend.json';
  import mineRecommend from '@/assets/json/geo/vallis/mining-recommend.json';
  import toroidFishCave from '@/assets/json/geo/vallis/toroidfishcave.json';
  import toroidCave from '@/assets/json/geo/vallis/toroidcave.json';
  import kdrive from '@/assets/json/geo/vallis/kdrive.json';
  import oddity from '@/assets/json/geo/vallis/memoryfrag.json';
  import somachord from '@/assets/json/geo/vallis/somachord.json';
  import fishRecommendIcon from '@/assets/img/map_icons/fish-recommend.png';
  import mineRecommendIcon from '@/assets/img/map_icons/mine-recommend.png';
  import fishCaveIcon from '@/assets/img/map_icons/fishing-cave.png';
  import fishToroidCaveIcon from '@/assets/img/map_icons/toroid-fishing-cave.png';
  import toroidCaveIcon from '@/assets/img/map_icons/toroid-normal-cave.png';
  import caldaIcon from '@/assets/img/map_icons/calda-toroid.png';
  import solaIcon from '@/assets/img/map_icons/sola-toroid.png';
  import vegaIcon from '@/assets/img/map_icons/vega-toroid.png';
  import kdriveIcon from '@/assets/img/map_icons/kdrive.png';
  import oddityIcon from '@/assets/img/map_icons/memoryfrag.png';
  import somachordIcon from '@/assets/img/map_icons/somachord.png';

  import MapPopup from '@/components/MapPopup.vue';
  import OddityPopup from '@/components/OddityPopup.vue';

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
    iconSize: [33, 50],
  });

  const oddityMarker = L.icon({
    iconUrl: oddityIcon,
    iconSize: [50, 50],
  });

  const somachordMarker = L.icon({
    iconUrl: somachordIcon,
    iconSize: [32, 32],
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
        set: feature.properties.set,
        name: feature.properties.name,
        video: feature.properties.video
      }
    });
    layer.bindPopup(popup.$mount().$el, { minWidth: 320});
  }

  const markerAlias = L.marker;
  const labelAlias = L.circleMarker;

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
            name: 'Map Label',
            json: labels,
            opts: {
              pointToLayer: function(feature, latlng) {
                return labelAlias(latlng)
                  .setStyle({
                    stroke: false,
                    fill: false
                  })
                  .bindTooltip(feature.properties.name, {
                    permanent: true,
                    direction: 'center',
                    className: 'map-label'
                  })
                  .openTooltip();
              }
            }
          },
          {
            name: 'Fishing',
            json: fish,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng);
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
          },
          {
            name: 'Oddity',
            json: oddity,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: oddityMarker});
              },
              onEachFeature: onEachOddity
            }
          },
          {
            name: 'Somachord Tone',
            json: somachord,
            opts: {
              pointToLayer: function(feature, latlng) {
                return markerAlias(latlng, {icon: somachordMarker});
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
      }
    },
    mounted: function () {},
  };
</script>

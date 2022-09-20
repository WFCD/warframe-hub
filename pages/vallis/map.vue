<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <l-map ref="vmap" :zoom="zoom" :center="center" :options="mapOptions" :crs="crs" :style="mapStyle">
          <l-image-overlay :url="url" :bounds="bounds" />
        </l-map>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue';
import L from 'leaflet';

import { mapGetters } from 'vuex';
import { cdn } from '@/services/utilities';

/* map stuff */
import fish from '@/static/json/geo/vallis/fishing.json';
import labels from '@/static/json/geo/vallis/labels.json';
import fishRecommend from '@/static/json/geo/vallis/fishing-recommend.json';
import mineRecommend from '@/static/json/geo/vallis/mining-recommend.json';
import toroidFishCave from '@/static/json/geo/vallis/toroidfishcave.json';
import toroidCave from '@/static/json/geo/vallis/toroidcave.json';
import fishCave from '@/static/json/geo/vallis/fishcave.json';
import kdrive from '@/static/json/geo/vallis/kdrive.json';
import oddity from '@/static/json/geo/vallis/memoryfrag.json';
import somachord from '@/static/json/geo/vallis/somachord.json';
import toroids from '@/static/json/geo/vallis/toroids.json';

import MapPopup from '@/components/MapPopup.jsx';
import OddityPopup from '@/components/OddityPopup.jsx';

const vallis = cdn('webp/maps/orbvallis.webp');
const fishRecommendIcon = cdn('webp/map_icons/fish-recommend.webp');
const mineRecommendIcon = cdn('webp/map_icons/mine-recommend.webp');
const fishCaveIcon = cdn('webp/map_icons/fishing-cave.webp');
const fishToroidCaveIcon = cdn('webp/map_icons/toroid-fishing-cave.webp');
const toroidCaveIcon = cdn('webp/map_icons/toroid-normal-cave.webp');
const caldaIcon = cdn('webp/map_icons/calda-toroid.webp');
const solaIcon = cdn('webp/map_icons/sola-toroid.webp');
const vegaIcon = cdn('webp/map_icons/vega-toroid.webp');
const kdriveIcon = cdn('webp/map_icons/kdrive.webp');
const oddityIcon = cdn('webp/map_icons/memoryfrag.webp');
const somachordIcon = cdn('webp/map_icons/somachord.webp');

const fishRecommendMarker = L.icon({
  iconUrl: fishRecommendIcon,
  iconSize: [50, 34],
});

const mineRecommendMarker = L.icon({
  iconUrl: mineRecommendIcon,
  iconSize: [50, 34],
});

const fishCaveMarker = L.icon({
  iconUrl: fishCaveIcon,
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

const caldaMarker = L.icon({
  iconUrl: caldaIcon,
  iconSize: [90, 62],
});

const solaMarker = L.icon({
  iconUrl: solaIcon,
  iconSize: [90, 62],
});

const vegaMarker = L.icon({
  iconUrl: vegaIcon,
  iconSize: [90, 62],
});

function onEachFeature(feature, layer) {
  const Popup = Vue.extend(MapPopup);
  const popup = new Popup({
    propsData: {
      type: feature.geometry.type,
      text: feature.properties.name,
    },
  });
  layer.bindPopup(popup.$mount().$el);
}

function onEachOddity(feature, layer) {
  const Popup = Vue.extend(OddityPopup);
  const popup = new Popup({
    propsData: {
      type: feature.geometry.type,
      set: feature.properties.set,
      name: feature.properties.name,
      video: feature.properties.video,
    },
  });
  layer.bindPopup(popup.$mount().$el, { minWidth: 320 });
}

function toroidMarkerFromName(name) {
  if (name.startsWith('Calda')) {
    return caldaMarker;
  } else if (name.startsWith('Sola')) {
    return solaMarker;
  } else if (name.startsWith('Vega')) {
    return vegaMarker;
  }

  return null;
}

function caveMarkerFromName(name) {
  if (name.startsWith('Fishing Cave')) {
    return fishCaveMarker;
  } else if (name.startsWith('Toroid Cave')) {
    return toroidCaveMarker;
  } else if (name.startsWith('Toroid Fish Cave')) {
    return fishToroidCaveMarker;
  }

  return null;
}

const markerAlias = L.marker;
const labelAlias = L.circleMarker;

export default {
  name: 'VallisMapView',
  data() {
    return {
      zoom: -1,
      center: L.latLng(942, 1060),
      url: vallis,
      bounds: [
        [0, 0],
        [2150, 2153],
      ],
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
            pointToLayer(feature, latlng) {
              return labelAlias(latlng)
                .setStyle({
                  stroke: false,
                  fill: false,
                })
                .bindTooltip(feature.properties.name, {
                  permanent: true,
                  direction: 'center',
                  className: 'map-label',
                })
                .openTooltip();
            },
          },
        },
        {
          name: 'Fishing',
          json: fish,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng);
            },
            onEachFeature,
          },
        },
        {
          name: 'Fishing Spots',
          json: fishRecommend,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: fishRecommendMarker });
            },
            onEachFeature,
          },
        },
        {
          name: 'Mining Spots',
          json: mineRecommend,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: mineRecommendMarker });
            },
            onEachFeature,
          },
        },
        {
          name: 'K-Drive',
          json: kdrive,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: kdriveMarker });
            },
            onEachFeature,
          },
        },
        {
          name: 'Oddity',
          json: oddity,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: oddityMarker });
            },
            onEachFeature: onEachOddity,
          },
        },
        {
          name: 'Somachord Tone',
          json: somachord,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: somachordMarker });
            },
            onEachFeature,
          },
        },
        {
          name: 'Toroids',
          json: toroids,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: toroidMarkerFromName(feature.properties.name) });
            },
            onEachFeature,
          },
        },
        {
          name: 'Special Caves',
          json: fishCave.concat(toroidCave).concat(toroidFishCave),
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: caveMarkerFromName(feature.properties.name) });
            },
            onEachFeature,
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters('worldstate', ['vallisMapToggles']),
    toggles: {
      get() {
        return this.vallisMapToggles;
      },
      set(toggles) {
        this.$store.commit('worldstate/vallisMapToggles', [toggles]);
      },
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.map = this.$refs.vmap.mapObject;
      // Now add each of our geos to a new layer
      const layerGroups = {};
      this.geo.forEach((g) => {
        const lg = L.layerGroup();
        L.geoJSON(g.json, g.opts).addTo(lg);
        layerGroups[g.name] = lg;
        // and if that layer's toggle vlaue is true, add it to the map immediately
        if (this.toggles[g.name + '-toggle-value']) {
          lg.addTo(this.map);
        }
      });
      // Add all of the layer groups to the map
      L.control.layers(null, layerGroups, { collapsed: false }).addTo(this.map);
      // Now wire up an event when the user toggles one of the layers to update localstorage
      this.map.on('overlayadd overlayremove', (e) => {
        const updated = {};
        Object.keys(this.toggles).forEach((toggle) => {
          updated[toggle] =
            this.toggles[toggle] === `${e.name}-toggle-value` ? e.type === 'overlayadd' : this.toggles[toggle];
        });
        this.toggles = updated;
      });
    });
  },
  methods: {},
};
</script>

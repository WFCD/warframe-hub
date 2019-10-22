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

/* map stuff */
import vallis from '@/assets/img/orbvallis.png';
import fish from '@/assets/json/geo/vallis/fishing.json';
import labels from '@/assets/json/geo/vallis/labels.json';
import fishRecommend from '@/assets/json/geo/vallis/fishing-recommend.json';
import mineRecommend from '@/assets/json/geo/vallis/mining-recommend.json';
import toroidFishCave from '@/assets/json/geo/vallis/toroidfishcave.json';
import toroidCave from '@/assets/json/geo/vallis/toroidcave.json';
import fishCave from '@/assets/json/geo/vallis/fishcave.json';
import kdrive from '@/assets/json/geo/vallis/kdrive.json';
import oddity from '@/assets/json/geo/vallis/memoryfrag.json';
import somachord from '@/assets/json/geo/vallis/somachord.json';
import toroids from '@/assets/json/geo/vallis/toroids.json';
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
  let Popup = Vue.extend(MapPopup);
  let popup = new Popup({
    propsData: {
      type: feature.geometry.type,
      text: feature.properties.name,
    },
  });
  layer.bindPopup(popup.$mount().$el);
}

function onEachOddity(feature, layer) {
  let Popup = Vue.extend(OddityPopup);
  let popup = new Popup({
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

function data() {
  return {
    zoom: -1,
    center: L.latLng(942, 1060),
    url: vallis,
    bounds: [[0, 0], [2150, 2153]],
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
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng);
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Fishing Spots',
        json: fishRecommend,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: fishRecommendMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Mining Spots',
        json: mineRecommend,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: mineRecommendMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'K-Drive',
        json: kdrive,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: kdriveMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Oddity',
        json: oddity,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: oddityMarker });
          },
          onEachFeature: onEachOddity,
        },
      },
      {
        name: 'Somachord Tone',
        json: somachord,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: somachordMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Toroids',
        json: toroids,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: toroidMarkerFromName(feature.properties.name) });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Special Caves',
        json: fishCave.concat(toroidCave).concat(toroidFishCave),
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: caveMarkerFromName(feature.properties.name) });
          },
          onEachFeature: onEachFeature,
        },
      },
    ],
  };
}

function mounted() {
  this.map = this.$refs.vmap.mapObject;
  // Get our toggle values from local storage
  let toggles = this.$store.getters.vallisMapToggles;
  // Now add each of our geos to a new layer
  var layerGroups = {};
  data().geo.forEach((g) => {
    var lg = L.layerGroup();
    L.geoJSON(g.json, g.opts).addTo(lg);
    layerGroups[g.name] = lg;
    // and if that layer's toggle vlaue is true, add it to the map immediately
    if (toggles[g.name + '-toggle-value']) {
      lg.addTo(this.map);
    }
  });
  // Add all of the layer groups to the map
  L.control.layers(null, layerGroups, { collapsed: false }).addTo(this.map);
  // Now wire up an event when the user toggles one of the layers to update localstorage
  this.map.on('overlayadd overlayremove', (e) => {
    toggles[e.name + '-toggle-value'] = e.type === 'overlayadd';
    this.$store.commit('vallisMapToggles', [toggles]);
  });
}

export default {
  name: 'Vallismap',
  data: data,
  methods: {
    track() {
      this.$ga.page('/vallis/map');
    },
  },
  mounted: mounted,
};
</script>

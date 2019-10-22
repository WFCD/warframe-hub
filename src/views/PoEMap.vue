<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <l-map ref="pmap" :zoom="zoom" :center="center" :options="mapOptions" :crs="crs" :style="mapStyle">
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
import plains from '@/assets/img/plains.png';
import labels from '@/assets/json/geo/plains/labels.json';
import fish from '@/assets/json/geo/plains/fishing.json';
import grineer from '@/assets/json/geo/plains/grineer.json';
import lorefish from '@/assets/json/geo/plains/lorefish.json';
import wisp from '@/assets/json/geo/plains/wisp.json';
import lure from '@/assets/json/geo/plains/lure.json';
import cave from '@/assets/json/geo/plains/cave.json';
import grineerIcon from '@/assets/img/map_icons/grineer.png';
import oddityIcon from '@/assets/img/map_icons/lorefish.png';
import wispIcon from '@/assets/img/map_icons/wisp.png';
import lureIcon from '@/assets/img/map_icons/lure.png';
import caveIcon from '@/assets/img/map_icons/normal-cave.png';
import MapPopup from '@/components/MapPopup.vue';
import OddityPopup from '@/components/OddityPopup.vue';

const grineerMarker = L.icon({
  iconUrl: grineerIcon,
  iconSize: [25, 25],
});

const oddityMarker = L.icon({
  iconUrl: oddityIcon,
  iconSize: [33, 25],
});

const wispMarker = L.icon({
  iconUrl: wispIcon,
  iconSize: [50, 33],
});

const lureMarker = L.icon({
  iconUrl: lureIcon,
  iconSize: [50, 50],
});

const caveMarker = L.icon({
  iconUrl: caveIcon,
  iconSize: [25, 25],
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

function data() {
  return {
    zoom: 0,
    center: L.latLng(472, 535),
    url: plains,
    bounds: [[0, 0], [994, 1012]],
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
        name: 'Grineer Camp',
        json: grineer,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: grineerMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Oddity',
        json: lorefish,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: oddityMarker });
          },
          onEachFeature: onEachOddity,
        },
      },
      {
        name: 'Cetus Wisp',
        json: wisp,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: wispMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Vomvalyst Lure',
        json: lure,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: lureMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
      {
        name: 'Cave Entrance',
        json: cave,
        opts: {
          pointToLayer: function(feature, latlng) {
            return markerAlias(latlng, { icon: caveMarker });
          },
          onEachFeature: onEachFeature,
        },
      },
    ],
  };
}

function mounted() {
  this.map = this.$refs.pmap.mapObject;
  // Get our toggle values from local storage
  let toggles = this.$store.getters.poeMapToggles;
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
    this.$store.commit('poeMapToggles', [toggles]);
  });
}

const markerAlias = L.marker;
const labelAlias = L.circleMarker;

export default {
  name: 'Poemap',
  data: data,
  methods: {
    track() {
      this.$ga.page('/poe/map');
    },
  },
  mounted: mounted,
};
</script>

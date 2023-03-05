<template>
  <base-map v-bind="properties" ref="pmapwrap" />
</template>

<script>
import L from 'leaflet';

/* map stuff */
import { mapGetters } from 'vuex';
import labels from '@/static/json/geo/plains/labels.json';
import fish from '@/static/json/geo/plains/fishing.json';
import grineer from '@/static/json/geo/plains/grineer.json';
import lorefish from '@/static/json/geo/plains/lorefish.json';
import wisp from '@/static/json/geo/plains/wisp.json';
import lure from '@/static/json/geo/plains/lure.json';
import cave from '@/static/json/geo/plains/cave.json';

import { cdn } from '@/services/utilities';
import { onEachFeature, onEachOddity, markerAlias, labelAlias } from '@/services/utilities/maps';
import BaseMap from '@/components/BaseMap';

const plains = cdn('webp/maps/plains.webp');
const caveIcon = cdn('webp/map_icons/normal-cave.webp');
const grineerIcon = cdn('webp/map_icons/grineer.webp');
const oddityIcon = cdn('webp/map_icons/lorefish.webp');
const wispIcon = cdn('webp/map_icons/wisp.webp');
const lureIcon = cdn('webp/map_icons/lure.webp');

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
export default {
  name: 'CetusMapView',
  components: {
    'base-map': BaseMap,
  },
  data() {
    return {
      zoom: 0,
      center: L.latLng(472, 535),
      url: plains,
      bounds: [
        [0, 0],
        [994, 1012],
      ],
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
          name: 'Grineer Camp',
          json: grineer,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: grineerMarker });
            },
            onEachFeature,
          },
        },
        {
          name: 'Oddity',
          json: lorefish,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: oddityMarker });
            },
            onEachFeature: onEachOddity,
          },
        },
        {
          name: 'Cetus Wisp',
          json: wisp,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: wispMarker });
            },
            onEachFeature,
          },
        },
        {
          name: 'Vomvalyst Lure',
          json: lure,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: lureMarker });
            },
            onEachFeature,
          },
        },
        {
          name: 'Cave Entrance',
          json: cave,
          opts: {
            pointToLayer(feature, latlng) {
              return markerAlias(latlng, { icon: caveMarker });
            },
            onEachFeature,
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters('worldstate', ['poeMapToggles']),
    toggles: {
      get() {
        return this.poeMapToggles;
      },
      set(toggles) {
        this.$store.commit('worldstate/poeMapToggles', [toggles]);
      },
    },
    properties: {
      get() {
        return {
          reference: 'pmap',
          bounds: this.bounds,
          url: this.url,
          mapOptions: this.mapOptions,
          center: this.center,
        };
      },
    },
    map: {
      get() {
        return this.$refs.pmapwrap.$refs.pmap.mapObject;
      },
    },
  },
  mounted() {
    this.$nextTick(function () {
      // Get our toggle values from local storage
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
      // Add all the layer groups to the map
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
};
</script>

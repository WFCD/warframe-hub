<template>
  <base-map ref="deimosmapwrap" v-bind="properties" />
</template>

<script>
import L from 'leaflet';

/* map stuff */
import { mapGetters } from 'vuex';

import { cdn } from '@/services/utilities';

import BaseMap from '~/components/BaseMap';

const drift = cdn('webp/maps/cambion-drift.webp');

export default {
  name: 'DeimosMapView',
  components: {
    'base-map': BaseMap,
  },
  data() {
    return {
      zoom: -1.5,
      center: L.latLng(1904, 2530),
      url: drift,
      bounds: [
        [0, 0],
        [3848, 5232],
      ],
      currentCenter: L.latLng(1904, 2530),
      mapOptions: {
        zoomSnap: 0.5,
        attributionControl: false,
        minZoom: -10,
      },
      crs: L.CRS.Simple,
      mapStyle: {
        height: 'calc(100vh - 100px)',
        width: '100%',
      },
      geo: [],
    };
  },
  computed: {
    ...mapGetters('worldstate', ['poeMapToggles']),
    toggles: {
      get() {
        return this.poeMapToggles;
      },
      set(toggles) {
        this.$store.commit('worldstate/deimosMapToggles', [toggles]);
      },
    },
    properties: {
      get() {
        return {
          zoom: this.zoom,
          reference: 'deimosmap',
          bounds: this.bounds,
          url: this.url,
          mapOptions: this.mapOptions,
          center: this.center,
        };
      },
    },
    map: {
      get() {
        return this.$refs.deimosmapwrap.$refs.deimosmap.mapObject;
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

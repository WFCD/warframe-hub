<template>
  <base-map ref="deimosmapwrap" v-bind="properties" />
</template>

<script>
import L from 'leaflet';

/* map stuff */
import { mapGetters } from 'vuex';

import labels from 'static/json/geo/deimos/labels.json';
import teleporter from 'static/json/geo/deimos/teleporter.json';
import cave from 'static/json/geo/deimos/cave.json';
import necramech from 'static/json/geo/deimos/necramech.json';
import bounty from 'static/json/geo/deimos/bounty.json';
import kdrive from 'static/json/geo/deimos/kdrive.json';
import { cdn } from '@/services/utilities';

import BaseMap from '@/components/BaseMap';
import { makeMapLabel, markers, layerUpdate, markerOpts } from '@/services/utilities/maps';

const drift = cdn('webp/maps/cambion-drift.webp');

const caveMarker = (feature) => {
  if (feature.properties.name.startsWith('Dead')) return markers.deadCave;
  else return markers.cave;
};

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
      mapOptions: {
        zoomSnap: 0.1,
        attributionControl: false,
        minZoom: -2,
        zoomDelta: 0.25,
      },
      crs: L.CRS.Simple,
      mapStyle: {
        height: 'calc(100vh - 100px)',
        width: '100%',
      },
      geo: [
        makeMapLabel(labels),
        {
          name: 'Teleporter',
          json: teleporter,
          opts: markerOpts({ icon: markers.blinkpad }),
        },
        {
          name: 'Cave Entrance',
          json: cave,
          opts: markerOpts({ iconGenerator: caveMarker }),
        },
        {
          name: 'Necramech',
          json: necramech,
          opts: markerOpts({ icon: markers.necramech }),
        },
        {
          name: 'Mother Bounty',
          json: bounty,
          opts: markerOpts({ icon: markers.motherBounty }),
        },
        {
          name: 'K-Drive',
          json: kdrive,
          opts: markerOpts({ icon: markers.kdrive }),
        },
      ],
    };
  },
  computed: {
    ...mapGetters('worldstate', ['deimosMapToggles']),
    toggles: {
      get() {
        return this.deimosMapToggles;
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
        // and if that layer's toggle value is true, add it to the map immediately
        if (this.toggles[g.name + '-toggle-value']) {
          lg.addTo(this.map);
        }
      });
      // Add all the layer groups to the map
      L.control.layers(null, layerGroups, { collapsed: false }).addTo(this.map);
      // Now wire up an event when the user toggles one of the layers to update localstorage
      this.map.on('overlayadd overlayremove', layerUpdate.bind(this));
    });
  },
};
</script>

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
import { makeMapLabel, markers, layerUpdate, markerOpts } from '@/services/utilities/maps';
import BaseMap from '@/components/BaseMap';

const plains = cdn('webp/maps/plains.webp');

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
        makeMapLabel(labels),
        {
          name: 'Fishing',
          json: fish,
          opts: markerOpts(),
        },
        {
          name: 'Grineer Camp',
          json: grineer,
          opts: markerOpts({ icon: markers.grineer }),
        },
        {
          name: 'Oddity',
          json: lorefish,
          opts: markerOpts({ icon: markers.lorefish, oddity: true }),
        },
        {
          name: 'Cetus Wisp',
          json: wisp,
          opts: markerOpts({ icon: markers.wisp }),
        },
        {
          name: 'Vomvalyst Lure',
          json: lure,
          opts: markerOpts({ icon: markers.lure }),
        },
        {
          name: 'Cave Entrance',
          json: cave,
          opts: markerOpts({ icon: markers.cave }),
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

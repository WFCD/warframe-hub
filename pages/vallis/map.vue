<template>
  <base-map v-bind="properties" ref="vmapwrap" />
</template>

<script>
import L from 'leaflet';

import { mapGetters } from 'vuex';
import { cdn } from '@/services/utilities';
import { makeMapLabel, markers, layerUpdate, markerOpts } from '@/services/utilities/maps';

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
import BaseMap from '@/components/BaseMap';

const vallis = cdn('webp/maps/orbvallis.webp');

function toroidMarkerFromName(feature) {
  if (feature.properties.name.startsWith('Calda')) {
    return markers.calda;
  } else if (feature.properties.name.startsWith('Sola')) {
    return markers.sola;
  } else if (feature.properties.name.startsWith('Vega')) {
    return markers.vega;
  }

  return null;
}

function caveMarkerFromName(feature) {
  if (feature.properties.name.startsWith('Fishing Cave')) {
    return markers.fishCave;
  } else if (feature.properties.name.startsWith('Toroid Cave')) {
    return markers.toroidCave;
  } else if (feature.properties.name.startsWith('Toroid Fish Cave')) {
    return markers.fishToroidCave;
  }

  return null;
}

export default {
  name: 'VallisMapView',
  components: {
    'base-map': BaseMap,
  },
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
        minZoom: -1,
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
          name: 'Fishing Spots',
          json: fishRecommend,
          opts: markerOpts({ icon: markers.fishRecommend }),
        },
        {
          name: 'Mining Spots',
          json: mineRecommend,
          opts: markerOpts({ icon: markers.mineRecommend }),
        },
        {
          name: 'K-Drive',
          json: kdrive,
          opts: markerOpts({ icon: markers.kdrive }),
        },
        {
          name: 'Oddity',
          json: oddity,
          opts: markerOpts({ icon: markers.memoryFragment, oddity: true }),
        },
        {
          name: 'Somachord Tone',
          json: somachord,
          opts: markerOpts({ icon: markers.somachord }),
        },
        {
          name: 'Toroids',
          json: toroids,
          opts: markerOpts({ iconGenerator: toroidMarkerFromName }),
        },
        {
          name: 'Special Caves',
          json: fishCave.concat(toroidCave).concat(toroidFishCave),
          opts: markerOpts({ iconGenerator: caveMarkerFromName }),
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
    properties: {
      get() {
        return {
          reference: 'vmap',
          bounds: this.bounds,
          url: this.url,
          mapOptions: this.mapOptions,
          center: this.center,
          zoom: this.zoom,
        };
      },
    },
    map: {
      get() {
        return this.$refs.vmapwrap.$refs.vmap.mapObject;
      },
    },
  },
  mounted() {
    this.$nextTick(function () {
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
  methods: {},
};
</script>

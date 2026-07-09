import Vue from 'vue';
import L from 'leaflet';
import MapPopup from '@/components/MapPopup';
import OddityPopup from '@/components/OddityPopup';
import { cdn } from '~/services/utilities';

export const onEachFeature = (feature, layer) => {
  const Popup = Vue.extend(MapPopup);
  const popup = new Popup({
    propsData: {
      type: feature.geometry.type,
      text: feature.properties.name,
    },
  });
  layer.bindPopup(popup.$mount().$el);
};

export const onEachOddity = (feature, layer) => {
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
};

export const markerAlias = L.marker;
export const labelAlias = L.circleMarker;

const caveIcon = cdn('webp/map_icons/normal-cave.webp');
const grineerIcon = cdn('webp/map_icons/grineer.webp');
const lorefishIcon = cdn('webp/map_icons/lorefish.webp');
const wispIcon = cdn('webp/map_icons/wisp.webp');
const lureIcon = cdn('webp/map_icons/lure.webp');
const deadCaveIcon = cdn('webp/map_icons/dead-cave.webp');

const fishRecommendIcon = cdn('webp/map_icons/fish-recommend.webp');
const mineRecommendIcon = cdn('webp/map_icons/mine-recommend.webp');
const fishCaveIcon = cdn('webp/map_icons/fishing-cave.webp');
const fishToroidCaveIcon = cdn('webp/map_icons/toroid-fishing-cave.webp');
const toroidCaveIcon = cdn('webp/map_icons/toroid-normal-cave.webp');
const caldaIcon = cdn('webp/map_icons/calda-toroid.webp');
const solaIcon = cdn('webp/map_icons/sola-toroid.webp');
const vegaIcon = cdn('webp/map_icons/vega-toroid.webp');
const kdriveIcon = cdn('webp/map_icons/kdrive-hex.webp');
const memoryFragmentIcon = cdn('webp/map_icons/memoryfrag.webp');
const somachordIcon = cdn('webp/map_icons/somachord.webp');
const necramechIcon = cdn('webp/map_icons/necramech.webp');
const motherBountyIcon = cdn('webp/map_icons/mother_bounty.webp');

const blinkpadIcon = cdn('webp/map_icons/blinkpad.webp');

export const makeMapLabel = (labels) => {
  return {
    name: 'Map Label',
    json: labels,
    opts: {
      pointToLayer(feature, latlng) {
        return labelAlias(latlng)
          .setStyle({
            stroke: false,
            fill: false,
            textShadow: '0 0 4px #000, 0 0 5px #000',
          })
          .bindTooltip(feature.properties.name, {
            permanent: true,
            direction: 'center',
            className: 'map-label',
          })
          .openTooltip();
      },
    },
  };
};

export function layerUpdate(e) {
  const updated = JSON.parse(JSON.stringify(this.toggles));
  const key = `${e.name}-toggle-value`;
  updated[key] = !this.toggles[key];
  this.toggles = updated;
}

export const markers = {
  cave: L.icon({
    iconUrl: caveIcon,
    iconSize: [25, 20],
  }),
  deadCave: L.icon({
    iconUrl: deadCaveIcon,
    iconSize: [36, 35],
  }),
  grineer: L.icon({
    iconUrl: grineerIcon,
    iconSize: [25, 25],
  }),
  lorefish: L.icon({
    iconUrl: lorefishIcon,
    iconSize: [33, 25],
  }),
  wisp: L.icon({
    iconUrl: wispIcon,
    iconSize: [50, 33],
  }),
  lure: L.icon({
    iconUrl: lureIcon,
    iconSize: [50, 50],
  }),
  fishRecommend: L.icon({
    iconUrl: fishRecommendIcon,
    iconSize: [50, 34],
  }),
  mineRecommend: L.icon({
    iconUrl: mineRecommendIcon,
    iconSize: [50, 34],
  }),
  fishCave: L.icon({
    iconUrl: fishCaveIcon,
    iconSize: [50, 34],
  }),
  fishToroidCave: L.icon({
    iconUrl: fishToroidCaveIcon,
    iconSize: [50, 34],
  }),
  toroidCave: L.icon({
    iconUrl: toroidCaveIcon,
    iconSize: [50, 34],
  }),
  kdrive: L.icon({
    iconUrl: kdriveIcon,
    iconSize: [29, 31],
  }),
  memoryFragment: L.icon({
    iconUrl: memoryFragmentIcon,
    iconSize: [50, 50],
  }),
  somachord: L.icon({
    iconUrl: somachordIcon,
    iconSize: [32, 32],
  }),
  calda: L.icon({
    iconUrl: caldaIcon,
    iconSize: [90, 62],
  }),
  sola: L.icon({
    iconUrl: solaIcon,
    iconSize: [90, 62],
  }),
  vega: L.icon({
    iconUrl: vegaIcon,
    iconSize: [90, 62],
  }),
  necramech: L.icon({
    iconUrl: necramechIcon,
    iconSize: [21, 24],
  }),
  motherBounty: L.icon({
    iconUrl: motherBountyIcon,
    iconSize: [32, 31],
  }),
  blinkpad: L.icon({
    iconUrl: blinkpadIcon,
    iconSize: [32, 31],
  }),
};

export const markerOpts = ({ icon, iconGenerator, oddity } = {}) => {
  return {
    pointToLayer(feature, latlng) {
      return markerAlias(latlng, { icon: iconGenerator ? iconGenerator(feature) : icon });
    },
    onEachFeature: oddity ? onEachOddity : onEachFeature,
  };
};

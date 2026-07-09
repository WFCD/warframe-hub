import L from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import { cdn } from '@wfcd/shared';

export type GeoEntry = {
  name: string;
  json: GeoJsonObject | Feature[];
  opts: L.GeoJSONOptions;
};

export const geoJson = (data: unknown): GeoJsonObject | Feature[] => data as GeoJsonObject | Feature[];

type NamedFeature = Feature & { properties: { name: string; set?: string; video?: string } };

export const onEachFeature = (feature: NamedFeature, layer: L.Layer) => {
  layer.bindPopup(feature.properties.name);
};

export const onEachOddity = (feature: NamedFeature, layer: L.Layer) => {
  const { set, name, video } = feature.properties;
  const html = `<div>
    <div>Oddity Set - <i>${set ?? 'Oddities'}</i></div>
    <div>Fragment Name: <b>${name}</b></div>
    <iframe title="${name}" src="${video ?? ''}" width="320" height="180" style="margin-right: 20px" frameborder="0" allowfullscreen></iframe>
  </div>`;
  layer.bindPopup(html, { minWidth: 320 });
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

export const makeMapLabel = (labels: unknown): GeoEntry => ({
  name: 'Map Label',
  json: geoJson(labels),
  opts: {
    pointToLayer(feature, latlng) {
      return labelAlias(latlng)
        .setStyle({
          stroke: false,
          fill: false,
          // @ts-expect-error leaflet circleMarker style extension
          textShadow: '0 0 4px #000, 0 0 5px #000',
        })
        .bindTooltip((feature.properties as { name: string }).name, {
          permanent: true,
          direction: 'center',
          className: 'map-label',
        })
        .openTooltip();
    },
  },
});

type MarkerOptsArgs = {
  icon?: L.Icon;
  iconGenerator?: (feature: NamedFeature) => L.Icon | null | undefined;
  oddity?: boolean;
};

export const markers = {
  cave: L.icon({ iconUrl: caveIcon, iconSize: [25, 20] }),
  deadCave: L.icon({ iconUrl: deadCaveIcon, iconSize: [36, 35] }),
  grineer: L.icon({ iconUrl: grineerIcon, iconSize: [25, 25] }),
  lorefish: L.icon({ iconUrl: lorefishIcon, iconSize: [33, 25] }),
  wisp: L.icon({ iconUrl: wispIcon, iconSize: [50, 33] }),
  lure: L.icon({ iconUrl: lureIcon, iconSize: [50, 50] }),
  fishRecommend: L.icon({ iconUrl: fishRecommendIcon, iconSize: [50, 34] }),
  mineRecommend: L.icon({ iconUrl: mineRecommendIcon, iconSize: [50, 34] }),
  fishCave: L.icon({ iconUrl: fishCaveIcon, iconSize: [50, 34] }),
  fishToroidCave: L.icon({ iconUrl: fishToroidCaveIcon, iconSize: [50, 34] }),
  toroidCave: L.icon({ iconUrl: toroidCaveIcon, iconSize: [50, 34] }),
  kdrive: L.icon({ iconUrl: kdriveIcon, iconSize: [29, 31] }),
  memoryFragment: L.icon({ iconUrl: memoryFragmentIcon, iconSize: [50, 50] }),
  somachord: L.icon({ iconUrl: somachordIcon, iconSize: [32, 32] }),
  calda: L.icon({ iconUrl: caldaIcon, iconSize: [90, 62] }),
  sola: L.icon({ iconUrl: solaIcon, iconSize: [90, 62] }),
  vega: L.icon({ iconUrl: vegaIcon, iconSize: [90, 62] }),
  necramech: L.icon({ iconUrl: necramechIcon, iconSize: [21, 24] }),
  motherBounty: L.icon({ iconUrl: motherBountyIcon, iconSize: [32, 31] }),
  blinkpad: L.icon({ iconUrl: blinkpadIcon, iconSize: [32, 31] }),
};

export const markerOpts = ({ icon, iconGenerator, oddity }: MarkerOptsArgs = {}): L.GeoJSONOptions => ({
  pointToLayer(feature, latlng) {
    const resolved = iconGenerator ? iconGenerator(feature as NamedFeature) : icon;
    return markerAlias(latlng, { icon: resolved ?? undefined });
  },
  onEachFeature: oddity ? onEachOddity : onEachFeature,
});

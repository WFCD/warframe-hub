'use client';

import { useMemo, type FC } from 'react';
import L from 'leaflet';
import { cdn } from '@wfcd/shared';
import BaseMap from '@/components/maps/BaseMap';
import { MapLayers } from '@/components/maps/MapLayers';
import fish from '@/data/json/geo/vallis/fishing.json';
import labels from '@/data/json/geo/vallis/labels.json';
import fishRecommend from '@/data/json/geo/vallis/fishing-recommend.json';
import mineRecommend from '@/data/json/geo/vallis/mining-recommend.json';
import toroidFishCave from '@/data/json/geo/vallis/toroidfishcave.json';
import toroidCave from '@/data/json/geo/vallis/toroidcave.json';
import fishCave from '@/data/json/geo/vallis/fishcave.json';
import kdrive from '@/data/json/geo/vallis/kdrive.json';
import oddity from '@/data/json/geo/vallis/memoryfrag.json';
import somachord from '@/data/json/geo/vallis/somachord.json';
import toroids from '@/data/json/geo/vallis/toroids.json';
import { makeMapLabel, markers, markerOpts, geoJson, type GeoEntry } from '@/lib/maps';
import { useMaps } from '@/lib/providers/MapsProvider';

const vallis = cdn('webp/maps/orbvallis.webp');

const toroidMarkerFromName = (feature: { properties: { name: string } }) => {
  if (feature.properties.name.startsWith('Calda')) return markers.calda;
  if (feature.properties.name.startsWith('Sola')) return markers.sola;
  if (feature.properties.name.startsWith('Vega')) return markers.vega;
  return null;
};

const caveMarkerFromName = (feature: { properties: { name: string } }) => {
  if (feature.properties.name.startsWith('Fishing Cave')) return markers.fishCave;
  if (feature.properties.name.startsWith('Toroid Cave')) return markers.toroidCave;
  if (feature.properties.name.startsWith('Toroid Fish Cave')) return markers.fishToroidCave;
  return null;
};
const VallisMapView: FC = () => {
  const { state, setVallisMapToggles } = useMaps();
  const toggles = state.vallisMapToggles;

  const geo = useMemo<GeoEntry[]>(
    () => [
      makeMapLabel(labels),
      { name: 'Fishing', json: geoJson(fish), opts: markerOpts() },
      { name: 'Fishing Spots', json: geoJson(fishRecommend), opts: markerOpts({ icon: markers.fishRecommend }) },
      { name: 'Mining Spots', json: geoJson(mineRecommend), opts: markerOpts({ icon: markers.mineRecommend }) },
      { name: 'K-Drive', json: geoJson(kdrive), opts: markerOpts({ icon: markers.kdrive }) },
      { name: 'Oddity', json: geoJson(oddity), opts: markerOpts({ icon: markers.memoryFragment, oddity: true }) },
      { name: 'Somachord Tone', json: geoJson(somachord), opts: markerOpts({ icon: markers.somachord }) },
      { name: 'Toroids', json: geoJson(toroids), opts: markerOpts({ iconGenerator: toroidMarkerFromName }) },
      {
        name: 'Special Caves',
        json: geoJson([...fishCave, ...toroidCave, ...toroidFishCave]),
        opts: markerOpts({ iconGenerator: caveMarkerFromName }),
      },
    ],

    []
  );

  return (
    <BaseMap
      title="Orb Vallis"
      zoom={-1}
      center={L.latLng(942, 1060)}
      url={vallis}
      bounds={[
        [0, 0],
        [2150, 2153],
      ]}
      mapOptions={{
        zoomSnap: 0.5,
        minZoom: -1,
        attributionControl: false,
      }}
    >
      <MapLayers geo={geo} toggles={toggles} onTogglesChange={setVallisMapToggles} />
    </BaseMap>
  );
};
export default VallisMapView;

'use client';

import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { cdn } from '@/lib/shared';
import BaseMap from '@/components/maps/BaseMap';
import { MapLayers } from '@/components/maps/MapLayers';
import labels from '@/data/json/geo/deimos/labels.json';
import teleporter from '@/data/json/geo/deimos/teleporter.json';
import cave from '@/data/json/geo/deimos/cave.json';
import necramech from '@/data/json/geo/deimos/necramech.json';
import bounty from '@/data/json/geo/deimos/bounty.json';
import kdrive from '@/data/json/geo/deimos/kdrive.json';
import { makeMapLabel, markers, markerOpts, geoJson, type GeoEntry } from '@/lib/maps';
import { useMaps } from '@/lib/providers/MapsProvider';

const drift = cdn('webp/maps/cambion-drift.webp');

const caveMarker = (feature: { properties: { name: string } }) => {
  if (feature.properties.name.startsWith('Dead')) return markers.deadCave;
  return markers.cave;
};
const DeimosMapView: FC = () => {
  const { t } = useTranslation();
  const { state, setDeimosMapToggles } = useMaps();
  const toggles = state.deimosMapToggles;

  const geo = useMemo<GeoEntry[]>(
    () => [
      makeMapLabel(labels),
      { name: 'Teleporter', json: geoJson(teleporter), opts: markerOpts({ icon: markers.blinkpad }) },
      { name: 'Cave Entrance', json: geoJson(cave), opts: markerOpts({ iconGenerator: caveMarker }) },
      { name: 'Necramech', json: geoJson(necramech), opts: markerOpts({ icon: markers.necramech }) },
      { name: 'Mother Bounty', json: geoJson(bounty), opts: markerOpts({ icon: markers.motherBounty }) },
      { name: 'K-Drive', json: geoJson(kdrive), opts: markerOpts({ icon: markers.kdrive }) },
    ],

    []
  );

  return (
    <BaseMap
      title={t('maps.titles.cambionDrift')}
      zoom={-1.5}
      center={L.latLng(1904, 2530)}
      url={drift}
      bounds={[
        [0, 0],
        [3848, 5232],
      ]}
      mapOptions={{
        zoomSnap: 0.1,
        attributionControl: false,
        minZoom: -2,
        zoomDelta: 0.25,
      }}
    >
      <MapLayers geo={geo} toggles={toggles} onTogglesChange={setDeimosMapToggles} />
    </BaseMap>
  );
};
export default DeimosMapView;

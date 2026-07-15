'use client';

import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { cdn } from '@/lib/shared';
import BaseMap from '@/components/maps/BaseMap';
import { MapLayers } from '@/components/maps/MapLayers';
import labels from '@/data/json/geo/plains/labels.json';
import fish from '@/data/json/geo/plains/fishing.json';
import grineer from '@/data/json/geo/plains/grineer.json';
import lorefish from '@/data/json/geo/plains/lorefish.json';
import wisp from '@/data/json/geo/plains/wisp.json';
import lure from '@/data/json/geo/plains/lure.json';
import cave from '@/data/json/geo/plains/cave.json';
import { makeMapLabel, markers, markerOpts, geoJson, type GeoEntry } from '@/lib/maps';
import { useMaps } from '@/lib/providers/MapsProvider';

const plains = cdn('webp/maps/plains.webp');
const PoeMapView: FC = () => {
  const { t } = useTranslation();
  const { state, setPoeMapToggles } = useMaps();
  const toggles = state.poeMapToggles;

  const geo = useMemo<GeoEntry[]>(
    () => [
      makeMapLabel(labels),
      { name: 'Fishing', json: geoJson(fish), opts: markerOpts() },
      { name: 'Grineer Camp', json: geoJson(grineer), opts: markerOpts({ icon: markers.grineer }) },
      { name: 'Oddity', json: geoJson(lorefish), opts: markerOpts({ icon: markers.lorefish, oddity: true }) },
      { name: 'Cetus Wisp', json: geoJson(wisp), opts: markerOpts({ icon: markers.wisp }) },
      { name: 'Vomvalyst Lure', json: geoJson(lure), opts: markerOpts({ icon: markers.lure }) },
      { name: 'Cave Entrance', json: geoJson(cave), opts: markerOpts({ icon: markers.cave }) },
    ],

    []
  );

  return (
    <BaseMap
      title={t('maps.titles.plainsOfEidolon')}
      zoom={0}
      center={L.latLng(472, 535)}
      url={plains}
      bounds={[
        [0, 0],
        [994, 1012],
      ]}
      mapOptions={{
        zoomSnap: 0.5,
        attributionControl: false,
      }}
    >
      <MapLayers geo={geo} toggles={toggles} onTogglesChange={setPoeMapToggles} />
    </BaseMap>
  );
};
export default PoeMapView;

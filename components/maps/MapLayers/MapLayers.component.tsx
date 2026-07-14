'use client';

import { useEffect, useRef, type FC } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { GeoEntry } from '@/lib/maps';

type MapLayersProps = {
  geo: GeoEntry[];
  toggles: Record<string, boolean>;
  onTogglesChange: (t: Record<string, boolean>) => void;
};

export const MapLayers: FC<MapLayersProps> = ({ geo, toggles, onTogglesChange }: MapLayersProps) => {
  const map = useMap();
  const togglesRef = useRef(toggles);
  togglesRef.current = toggles;
  const onChangeRef = useRef(onTogglesChange);
  onChangeRef.current = onTogglesChange;

  useEffect(() => {
    const layerGroups: Record<string, L.LayerGroup> = {};
    geo.forEach((g) => {
      const lg = L.layerGroup();
      L.geoJSON(g.json, g.opts).addTo(lg);
      layerGroups[g.name] = lg;
      if (togglesRef.current[`${g.name}-toggle-value`]) {
        lg.addTo(map);
      }
    });

    const control = L.control.layers(undefined, layerGroups, { collapsed: false });
    control.addTo(map);

    const handler = (e: L.LeafletEvent) => {
      const evt = e as L.LayersControlEvent;
      const updated = { ...togglesRef.current };
      const key = `${evt.name}-toggle-value`;
      updated[key] = !togglesRef.current[key];
      onChangeRef.current(updated);
    };
    map.on('overlayadd overlayremove', handler);

    return () => {
      map.off('overlayadd overlayremove', handler);
      map.removeControl(control);
      Object.values(layerGroups).forEach((lg) => map.removeLayer(lg));
    };
  }, [map, geo]);

  return null;
};

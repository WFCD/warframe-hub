'use client';
import './BaseMap.component.scss';

import type { CSSProperties, ReactNode, FC } from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ContentPage from '@/components/pages/ContentPage';

type BaseMapProps = {
  zoom?: number;
  center: L.LatLngExpression;
  mapOptions?: L.MapOptions;
  url: string;
  bounds: L.LatLngBoundsExpression;
  crs?: typeof L.CRS.Simple;
  mapStyle?: CSSProperties;
  title?: string;
  children?: ReactNode;
};
const BaseMap: FC<BaseMapProps> = ({
  zoom = 0,
  center,
  mapOptions = {},
  url,
  bounds,
  crs = L.CRS.Simple,
  mapStyle,
  title,
  children,
}: BaseMapProps) => {
  return (
    <ContentPage title={title} variant="map">
      <MapContainer
        center={center}
        zoom={zoom}
        crs={crs}
        className="hub-content-map"
        style={mapStyle}
        {...mapOptions}
      >
        <ImageOverlay url={url} bounds={bounds} />
        {children}
      </MapContainer>
    </ContentPage>
  );
};
export default BaseMap;

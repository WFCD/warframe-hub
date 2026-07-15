'use client';
import './BaseMap.component.scss';

import { useEffect, type CSSProperties, type ReactNode, type FC } from 'react';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ContentPage from '@/components/pages/ContentPage';

const MapResize: FC = () => {
  const map = useMap();

  useEffect(() => {
    let raf = 0;
    const invalidate = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    invalidate();
    window.addEventListener('resize', invalidate);
    const container = map.getContainer();
    const observer = new ResizeObserver(invalidate);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', invalidate);
      observer.disconnect();
    };
  }, [map]);

  return null;
};

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
    <ContentPage title={title} variant='map'>
      <MapContainer
        center={center}
        zoom={zoom}
        crs={crs}
        className='hub-content-map'
        style={mapStyle}
        {...mapOptions}
      >
        <MapResize />
        <ImageOverlay url={url} bounds={bounds} />
        {children}
      </MapContainer>
    </ContentPage>
  );
};
export default BaseMap;

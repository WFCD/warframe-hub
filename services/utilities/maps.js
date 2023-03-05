import Vue from 'vue';
import L from 'leaflet';
import MapPopup from '@/components/MapPopup';
import OddityPopup from '@/components/OddityPopup';

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

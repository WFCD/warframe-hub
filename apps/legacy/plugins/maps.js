import Vue from 'vue';

/* Leaflet */
import Vue2Leaflet, { L } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

// this part resolve an issue where the markers would not appear
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.use(L);
Vue.component('LMap', Vue2Leaflet.LMap);
Vue.component('LImageOverlay', Vue2Leaflet.LImageOverlay);
Vue.component('LMarker', Vue2Leaflet.LMarker);
Vue.component('LPopup', Vue2Leaflet.LPopup);
Vue.component('LPolyline', Vue2Leaflet.LPolyline);
Vue.component('LGeoJson', Vue2Leaflet.LGeoJson);
Vue.component('LTooltip', Vue2Leaflet.LTooltip);
Vue.component('LIcon', Vue2Leaflet.LIcon);
Vue.component('LControlLayers', Vue2Leaflet.LControlLayers);
Vue.component('LLayerGroup', Vue2Leaflet.LLayerGroup);
Vue.component('LCircleMarker', Vue2Leaflet.LCircleMarker);

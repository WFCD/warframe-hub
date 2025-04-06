/* Leaflet */
import {
  LMap,
  LImageOverlay,
  LMarker,
  LPopup,
  LPolyline,
  LGeoJson,
  LTooltip,
  LIcon,
  LLayerGroup,
  LCircleMarker,
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

import { defineNuxtPlugin } from '#app';

/* TODO: It's not clear what was imported with `import { L } from 'vue2-leaflet';`

import MarkerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';

// this part resolve an issue where the markers would not appear
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: MarkerIcon2x,
  iconUrl: MarkerIcon,
  shadowUrl: MarkerShadow,
});

Vue.use(L);
*/

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('LMap', LMap);
  nuxtApp.vueApp.component('LImageOverlay', LImageOverlay);
  nuxtApp.vueApp.component('LMarker', LMarker);
  nuxtApp.vueApp.component('LPopup', LPopup);
  nuxtApp.vueApp.component('LPolyline', LPolyline);
  nuxtApp.vueApp.component('LGeoJson', LGeoJson);
  nuxtApp.vueApp.component('LTooltip', LTooltip);
  nuxtApp.vueApp.component('LIcon', LIcon);
  // nuxtApp.vueApp.component('LControlLayers', LControlLayers); // TODO: This doesn't appear to work on @vue-leaflet/vue-leaflet, as opposed to vue2-leaflet. Check if this component is necessary
  nuxtApp.vueApp.component('LLayerGroup', LLayerGroup);
  nuxtApp.vueApp.component('LCircleMarker', LCircleMarker);
});

import Vue from 'vue';

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

Vue.component('LMap', LMap);
Vue.component('LImageOverlay', LImageOverlay);
Vue.component('LMarker', LMarker);
Vue.component('LPopup', LPopup);
Vue.component('LPolyline', LPolyline);
Vue.component('LGeoJson', LGeoJson);
Vue.component('LTooltip', LTooltip);
Vue.component('LIcon', LIcon);
// Vue.component('LControlLayers', LControlLayers); // TODO: This doesn't appear to work on @vue-leaflet/vue-leaflet, as opposed to vue2-leaflet. Check if this component is necessary
Vue.component('LLayerGroup', LLayerGroup);
Vue.component('LCircleMarker', LCircleMarker);

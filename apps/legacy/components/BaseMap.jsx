import L, { LatLng } from 'leaflet';

export default {
  name: 'BaseMap',
  props: {
    zoom: {
      type: Number,
      default: () => 0,
    },
    center: {
      type: Object,
      default: null,
      required: true,
      validator(thing) {
        return thing instanceof LatLng;
      },
    },
    mapOptions: {
      type: Object,
      default: null,
      required: true,
    },
    url: {
      type: String,
      default: undefined,
      required: true,
    },
    bounds: {
      type: Array,
      default: undefined,
      required: true,
    },
    crs: {
      type: Object,
      default() {
        return L.CRS.Simple;
      },
    },
    mapStyle: {
      type: Object,
      default() {
        return {
          height: 'calc(100vh - 100px)',
          width: '100%',
        };
      },
    },
    reference: {
      type: String,
      default: null,
      required: true,
    },
  },
  render() {
    return (
      <b-container fluid>
        <b-row>
          <b-col>
            <l-map
              ref={this.reference}
              zoom={this.zoom}
              center={this.center}
              options={this.mapOptions}
              crs={this.crs}
              style={this.mapStyle}
            >
              <l-image-overlay url={this.url} bounds={this.bounds} />
            </l-map>
          </b-col>
        </b-row>
      </b-container>
    );
  },
};

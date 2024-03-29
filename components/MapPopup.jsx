/*
  From  https://github.com/KoRiGaN/Vue2Leaflet/blob/master/examples/src/components/GeoJson2Popup.vue
*/
export default {
  name: 'MapPopup',
  props: {
    type: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
  render() {
    return <div>{this.text}</div>;
  },
};

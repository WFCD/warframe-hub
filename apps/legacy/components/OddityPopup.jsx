/*
  From  https://github.com/KoRiGaN/Vue2Leaflet/blob/master/examples/src/components/GeoJson2Popup.vue
*/
export default {
  name: 'OddityPopup',
  props: {
    type: {
      type: String,
      default: undefined,
    },
    set: {
      type: String,
      default: 'Oddities',
    },
    name: {
      type: String,
      default: 'Oddity',
    },
    video: {
      type: String,
      default: undefined,
    },
  },
  render() {
    return (
      <div>
        <div>
          Oddity Set - <i>{this.$props.set}</i>
        </div>
        <div>
          Fragment Name: <b>{this.$props.name}</b>
        </div>
        <iframe
          title={this.$props.name}
          src={this.$props.video}
          width="320"
          height="180"
          style="margin-right: 20px"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    );
  },
};

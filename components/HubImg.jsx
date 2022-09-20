const tooltips = {
  'v-b-tooltip.auto': true,
};
export default {
  name: 'HubImg',
  props: {
    src: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Name',
    },
    width: {
      type: String,
      default: '15px',
    },
    height: {
      type: String,
      default: '15px',
    },
  },
  render() {
    return (
      <span {...tooltips} title={this.name}>
        <img src={this.src} name={this.name} height={this.height} width={this.width} alt={this.name} />
      </span>
    );
  },
};

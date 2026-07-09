export default {
  name: 'HubPanelWrap',
  props: {
    title: {
      type: String,
      default: () => '',
    },
  },
  render() {
    return (
      <b-col sm={12} lg={6} xl={4} data-packer-item="true" class="panel-header binpacker-item mt-2">
        <h4 className="text-center header-panel">{this.title}</h4>
        {this.$slots.default}
      </b-col>
    );
  },
};

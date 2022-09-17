import HubImg from '@/components/HubImg.jsx';
import { cdn } from '@/services/utilities';

const loading = cdn('svg/loading.svg');
export default {
  name: 'NoDataItem',
  components: {
    HubImg,
  },
  props: { text: { type: String, default: () => 'Data' }, overrideBorder: { type: Boolean, default: () => false } },
  data() {
    return {
      loading,
    };
  },
  render() {
    return (
      <b-list-group-item class={{ 'py-1': true, 'list-group-item-borderbottom': !this.$props.overrideBorder }}>
        <span class="dim">
          <HubImg
            src={this.loading}
            name={this.$t('nav.nodata')}
            width="40px"
            height="40px"
            style="filter: invert(80%); padding-right: 10px"
          />
          <div class="no-content-warning align-middle" style="margin-bottom: 2px">
            {this.$t('nav.nodatatxt', { text: this.$props.text })}
          </div>
        </span>
      </b-list-group-item>
    );
  },
};

import dayjs from 'dayjs';
import HubImg from '@/components/HubImg.jsx';
import TimeBadge from '@/components/TimeBadge.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';
import NoDataItem from '@/components/NoDataItem.jsx';

import { cdn } from '@/services/utilities.js';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

const styles = {
  inline: {
    display: 'inline',
  },
  invert: {
    filter: 'invert(100%)',
  },
};

export default {
  name: 'ArbitrationPanel',
  components: {
    TimeBadge,
    HubImg,
    NoDataItem,
    HubPanelWrap,
  },
  props: {
    arbitration: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    notExpired() {
      return dayjs(this.$props.arbitration.expiry).format('x') >= dayjs().format('x');
    },
    now() {
      return dayjs().toISOString();
    },
    headertext() {
      return this.$t('arbitration.header');
    },
    factionImg() {
      const fImg = {
        corpus,
        grineer,
        infested,
        infestation: infested,
        corrupted,
        orokin: corrupted,
        sentient,
      };
      return fImg[this.$props.arbitration.enemy.toLowerCase()] || corrupted;
    },
  },
  render() {
    return (
      <HubPanelWrap title={this.headertext} class="arbitration">
        <b-list-group>
          {Object.keys(this.arbitration).length !== 0 && this.notExpired && (
            <b-list-group-item style={styles.inline} className="list-group-item-borderbottom">
              <span class="pull-left">
                <HubImg
                  src={this.factionImg}
                  name={this.arbitration.enemy}
                  style={styles.invert}
                  class="li-mission-decorator li-mission-decorator-lg"
                  height="20px"
                  width="20px"
                />
                <b>{this.arbitration.node}</b> | {this.arbitration.type}
              </span>
              <TimeBadge starttime={this.arbitration.activation} endtime={this.arbitration.expiry} interval={1000} />
            </b-list-group-item>
          )}
          {(Object.keys(this.arbitration).length === 0 || !this.arbitration) && <NoDataItem text={this.headertext} />}
        </b-list-group>
      </HubPanelWrap>
    );
  },
};

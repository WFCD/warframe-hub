import dayjs from 'dayjs';
import NoDataItem from '@/components/NoDataItem.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';

const styleObject = {
  display: 'inline',
};
const acolyteIcons = {
  'margin-right': '10px',
};

export default {
  name: 'AcolytesPanel',
  components: {
    NoDataItem,
    HubPanelWrap,
  },
  props: ['acolytes'],
  data() {
    return {};
  },
  computed: {
    headertext() {
      return this.this.$t('acolytes.header');
    },
    none() {
      return this.this.$t('acolytes.na');
    },
    healthStr() {
      return this.this.$t('acolytes.health');
    },
  },
  methods: {
    dayjs,
    discovery(acolyte) {
      return this.this.$t(`acolytes.${acolyte.isDiscovered ? 'discovered' : 'hiding'}`);
    },
    health(acolyte) {
      return (acolyte.healthPercent * 100).toFixed(2);
    },
    healthLabel(acolyte) {
      const health = this.health(acolyte);
      let labelClass = 'success';
      if (health <= 80 && health > 50) {
        labelClass = 'info';
      } else if (health <= 50 && health > 20) {
        labelClass = 'warning';
      } else if (health <= 20) {
        labelClass = 'danger';
      }
      return labelClass;
    },
  },
  render() {
    return (
      <HubPanelWrap title={this.headertext} class={{ 'no-content': this.$props.acolytes.length === 0 }}>
        <b-list-group>
          {this.$props.acolytes.map((acolyte, index) => {
            return (
              <b-list-group-item
                key={acolyte.id}
                style={styleObject}
                className={{
                  'list-group-item-borderless': index !== this.$props.acolytes.length - 1,
                  'list-group-item-borderbottom': index === this.$props.acolytes.length - 1,
                }}
              >
                <span className={`badge badge-${this.healthLabel(acolyte)} pull-right`}>
                  <span id={`${acolyte.id}-health`}>{this.health(acolyte)}</span>%
                  <i v-b-tooltip className="fas fa-heartbeat" title={this.healthStr} style="margin-left: 5px"></i>
                </span>
                <span className="pull-left">
                  <b>
                    <i
                      v-if="acolyte.isDiscovered"
                      v-b-tooltip
                      className="far fa-eye faIcon"
                      title={`${acolyte.agentType} ${this.$t('acolytes.discovered')}`}
                      style={acolyteIcons}
                    />
                    <i
                      v-else
                      v-b-tooltip
                      className="far fa-eye-slash faIcon"
                      title={`${acolyte.agentType} ${this.discovery(acolyte)}`}
                      style={acolyteIcons}
                    />
                    {acolyte.agentType}
                  </b>
                </span>
                <br />
                <div style="margin-top: 2px">
                  <span className="pull-left">
                    <b>
                      <span id={`${acolyte.id}-loc`}>
                        {acolyte.isDiscovered ? '' : 'Last '} @{acolyte.lastDiscoveredAt || this.none}
                      </span>
                    </b>
                    | <b>Level: </b>
                    {acolyte.rank}
                  </span>
                  <b-badge id={`${acolyte.id}-lastDicoveredTime`} variant="info" className="pull-right timebadage">
                    {dayjs(acolyte.lastDiscoveredTime).fromNow()}
                  </b-badge>
                </div>
              </b-list-group-item>
            );
          })}
          {this.$props.acolytes.length === 0 && <NoDataItem text={this.headertext} />}
        </b-list-group>
      </HubPanelWrap>
    );
  },
};

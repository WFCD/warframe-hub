import TimeBadge from '@/components/TimeBadge.jsx';
import HubImg from '@/components/HubImg.jsx';
import NoDataItem from '@/components/NoDataItem.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';
import { cdn } from '@/services/utilities';

const archwing = cdn('svg/archwing.svg');
const nightmare = cdn('svg/nightmare.svg');

const styles = {
  inline: {
    display: 'inline',
  },
};

const Alert = {
  props: ['alert', 'index'],
  render() {
    return (
      this.alert.active && (
        <b-list-group-item
          key={this.alert.id}
          style={styles.inline}
          class={{
            'list-group-item-borderless': this.index !== this.alerts.length - 1,
            'list-group-item-borderbottom': this.index === this.alerts.length - 1,
          }}
        >
          <span class="pull-left">
            {this.alert.mission.archwingRequired && (
              <HubImg src={archwing} name={this.$t('alerts.archwing')} class="li-mission-decorator" />
            )}
            {this.alert.mission.nightmare && (
              <HubImg src={nightmare} name={this.$t('alerts.nightmare')} class="li-mission-decorator" />
            )}

            <b>{this.alert.mission.node}</b>
          </span>
          <TimeBadge starttime={this.alert.activation} endtime={this.alert.expiry} interval={1000} />
          {this.alert.mission.reward.items.map((item) => {
            return (
              <b-badge key={item} variant="info" style={styles.inline} class="pull-right">
                {item}
              </b-badge>
            );
          })}
          {this.alert.mission.reward.countedItems.map((item) => {
            return (
              <b-badge key={item.key} variant="info" style={styles.inline} class="pull-right">
                {item.count} {item.type}
              </b-badge>
            );
          })}
          <br />
          {this.alert.mission.reward.credits && (
            <b-badge variant="info" style={styles.inline} className="pull-right">
              {this.alert.mission.reward.credits}cr
            </b-badge>
          )}

          <div style="margin-top: 2px" class="pull-left">
            <b>{this.alert.mission.type}</b> ({this.alert.mission.faction}) | <b>{this.$t('alerts.level')} </b>
            {this.alert.mission.minEnemyLevel}-{this.alert.mission.maxEnemyLevel}
          </div>
        </b-list-group-item>
      )
    );
  },
};

export default {
  name: 'AlertPanel',
  props: {
    alerts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      archwing,
      nightmare,
    };
  },
  computed: {
    headertext() {
      return this.$t('alerts.header');
    },
  },
  render() {
    return (
      <HubPanelWrap title={this.headertext} class={{ 'no-content': this.alerts.length === 0 }}>
        <b-list-group>
          {this.alerts
            .map((alert, index) => {
              return <Alert alert={alert} index={index} />;
            })
            .filter((a) => a)}
          {this.alerts.length === 0 && <NoDataItem text={this.headertext} />}
        </b-list-group>
      </HubPanelWrap>
    );
  },
};

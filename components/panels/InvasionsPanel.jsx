import { mapGetters } from 'vuex';
import NoDataItem from '@/components/NoDataItem.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';
import Spoiler from '@/components/Spoiler.jsx';
import InvasionItem from '@/components/InvasionItem/InvasionItem.jsx';

const styles = {
  inline: {
    display: 'inline',
  },
  nopad: {
    padding: 0,
  },
  border(index, count) {
    if (index < count - 1) return 'list-group-item-borderless';
    if (index === count - 1) return 'list-group-item-borderbottom';
    return '';
  },
};

export default {
  name: 'InvasionsPanel',
  props: {
    invasions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters('worldstate', ['componentState']),
    headertext() {
      return this.$t('invasions.header');
    },
    maxInvasions() {
      return 5;
    },
    initialStatus() {
      return this.componentState?.invasions?.expand;
    },
    current() {
      return this.ongoing.slice(0, this.maxInvasions);
    },
    ongoing() {
      return this.invasions.filter((invasion) => !invasion.completed);
    },
    spoiler() {
      return this.ongoing.slice(this.maxInvasions, this.ongoing.length);
    },
  },
  methods: {
    updatePanelStatus() {
      const newState = {
        ...this.componentState.invasions,
        expand: !this.componentState.invasions.expand,
      };
      this.$store.commit('worldstate/commitComponent', ['invasions', newState]);
    },
  },
  render() {
    try {
      return (
        <HubPanelWrap title={this.headertext} class={`invasions ${!this.invasions.length && 'no-content'}`}>
          <b-list-group>
            {this.current.map((invasion, index) => {
              return (
                <b-list-group-item
                  key={invasion.id}
                  style={styles.inline}
                  class={styles.border(index, this.ongoing.length)}
                >
                  <InvasionItem invasion={invasion} />
                </b-list-group-item>
              );
            })}
            {this.ongoing.length > this.maxInvasions && (
              <b-list-group-item className="list-group-item-borderbottom" style={styles.nopad}>
                <Spoiler init={this.initialStatus} onToggle={this.updatePanelStatus}>
                  <b-list-group>
                    {this.spoiler.map((invasion, index) => {
                      return (
                        <b-list-group-item
                          key={invasion.id}
                          style={styles.inline}
                          class={styles.border(index, this.ongoing.length)}
                        >
                          <InvasionItem invasion={invasion} />
                        </b-list-group-item>
                      );
                    })}
                  </b-list-group>
                </Spoiler>
              </b-list-group-item>
            )}
            {this.current.length === 0 && <NoDataItem text={this.headertext} />}
          </b-list-group>
        </HubPanelWrap>
      );
    } catch (e) {
      console.error('Failed to load InvasionPanel', e);
      return <span />;
    }
  },
};

import dayjs from 'dayjs';

import HubImg from '@/components/HubImg.jsx';
import TimeBadge from '@/components/TimeBadge.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';
import { cdn } from '@/services/utilities';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');
const narmer = cdn('svg/factions/narmer2.svg');

const styles = {
  inline: {
    display: 'inline',
  },
  missionType: {
    filter: 'invert(100%)',
    'margin-top': '-3px',
    'margin-right': '5px',
    width: '25px',
    height: '25px',
  },
};
const tooltips = {
  'v-b-tooltip.top': true,
};

export default {
  name: 'SortiePanel',
  components: {
    TimeBadge,
    HubImg,
    HubPanelWrap,
  },
  props: {
    sortie: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    headertext() {
      return this.$props.sortie.missions.length ? this.$t('sortie.hunt.header') : this.$t('sortie.header');
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
        narmer,
      };
      return fImg[this.$props.sortie.faction.toLowerCase()] || corrupted;
    },
    missions() {
      return (this.$props.sortie?.variants?.length ? this.$props.sortie.variants : this.$props.sortie.missions) || [];
    },
  },
  render() {
    const now = dayjs().toISOString();
    return (
      <HubPanelWrap title={this.headertext} class="sortie">
        <b-list-group>
          <b-list-group-item style={styles.inline} class="list-group-item-borderless pb-0">
            <span class="pull-left">
              <h4 class="my-0">
                <HubImg
                  src={this.factionImg}
                  name={this.sortie.faction}
                  style={styles.missionType}
                  width="20px"
                  height="20px"
                />
                {this.sortie.boss}
              </h4>
            </span>
            <TimeBadge starttime={now} endtime={this.sortie.expiry} interval={1000} />
          </b-list-group-item>
          {this.missions.map((mission, index) => {
            return (
              <b-list-group-item
                key={`sortie-${index}`}
                style={styles.inline}
                class={{
                  'list-group-item-borderless': index !== this.missions.length - 1,
                  'pb-0': index !== this.missions.length - 1,
                  'list-group-item-borderbottom': index === this.missions.length - 1,
                }}
              >
                <div class="ml-3">
                  <span class="pull-left pr-2">
                    <b>
                      {mission.missionType || mission.type} - {mission.node}
                    </b>
                  </span>
                  <span {...tooltips} title={mission.modifierDescription} class="pull-left">
                    {mission.modifier}
                  </span>
                </div>
              </b-list-group-item>
            );
          })}
        </b-list-group>
      </HubPanelWrap>
    );
  },
};

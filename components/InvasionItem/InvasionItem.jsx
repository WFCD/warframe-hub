import HubImg from '@/components/HubImg.jsx';
import thumb from '@/components/AsyncItemThumb.jsx';
import { makeid, cdn } from '@/services/utilities.js';

import './InvasionItem.less';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

const getLabelColor = (faction) => {
  switch (faction) {
    case 'Corpus':
      return 'info';
    case 'Grineer':
      return 'danger';
    case 'Infested':
    case 'Infestation':
      return 'success';
    case 'Corrupted':
      return 'warning';
    default:
      return 'default';
  }
};
const countedItem = (item) => {
  if (item.count > 1) {
    return `${item.count} ${item.type}`;
  }
  return item.type;
};

export default {
  name: 'InvasionItem',
  props: {
    invasion: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      id: makeid(),
      fImg: {
        corpus,
        grineer,
        infested,
        infestation: infested,
        corrupted,
        orokin: corrupted,
        sentient,
      },
    };
  },
  computed: {
    atkFactionImg() {
      return this.fImg[this.$props.invasion.attacker.faction.toLowerCase()] || corrupted;
    },
    defFactionImg() {
      return this.fImg[this.$props.invasion.defender.faction.toLowerCase()] || corrupted;
    },
    atkFaction() {
      return (this.$props.invasion.attacker && this.$props.invasion.attacker.factionKey) || 'Corrupted';
    },
    defFaction() {
      return (this.$props.invasion.defender && this.$props.invasion.defender.factionKey) || 'Corrupted';
    },
    atkItems() {
      return this.$props?.invasion?.attacker?.reward?.items || [];
    },
    atkCntItems() {
      return this.$props?.invasion?.attacker?.reward?.countedItems || [];
    },
    defCntItems() {
      return this.$props?.invasion?.defender?.reward?.countedItems || [];
    },
    defItems() {
      return this.$props?.invasion?.defender?.reward?.items || [];
    },
  },
  methods: {
    eta(invasion) {
      const eta = invasion.eta
        .replace('-Infinityd', '??')
        .replace('Infinityd', '??')
        .replace(/\s\d\d?s/gi, '')
        .trim();
      return `${this.$t('invasions.eta')} ${eta}`;
    },
  },
  render() {
    try {
      return (
        <div class="invasion-container">
          <div id={`${this.invasion.id}_info`} class="text-center pb-1">
            <span>
              <b>{this.invasion.node}</b> - {this.invasion.desc}
            </span>
          </div>
          <b-row class="invasion-rewards p-0">
            <b-col>
              <div class="pull-left">
                {this.atkItems.map((item) => {
                  return (
                    <b-badge key={item} tag="div" variant={getLabelColor(this.atkFaction)} class="ml-n3">
                      <thumb alt={item} />
                    </b-badge>
                  );
                })}
                {this.atkCntItems.map((item) => {
                  return (
                    <b-badge key={item.type} tag="div" variant={getLabelColor(this.atkFaction)} class="ml-n3">
                      <thumb alt={countedItem(item)} ikey={item.key} />
                    </b-badge>
                  );
                })}
              </div>
              <div class="pull-right">
                {this.defItems.map((item) => {
                  return (
                    <b-badge key={item} variant={getLabelColor(this.defFaction)} class="mr-n3">
                      <thumb alt={item} />
                    </b-badge>
                  );
                })}
                {this.defCntItems.map((item) => {
                  return (
                    <b-badge key={item.type} variant={getLabelColor(this.defFaction)} class="mr-n3">
                      <thumb alt={countedItem(item)} ikey={item.key} />
                    </b-badge>
                  );
                })}
              </div>
            </b-col>
          </b-row>
          <b-row class="invasion-progress">
            <b-progress max={100} class="w-100 h-125">
              <b-progress-bar
                id={`${this.id}-attacker-progress`}
                variant={getLabelColor(this.invasion.attacker.factionKey)}
                value={this.invasion.completion}
                aria-label={`Current Attacker Progress: ${this.invasion.completion}`}
              />
              <b-progress-bar
                id={`${this.id}-defender-progress`}
                variant={getLabelColor(this.invasion.defender.factionKey)}
                value={100 - this.invasion.completion}
                aria-label={`Current Defender Progresss: ${100 - this.invasion.completion}`}
              />
              <small class="justify-content-center d-flex position-absolute w-100 progress-value">
                {this.invasion.completion.toFixed(2)}% - {this.eta(this.invasion)}
              </small>
              <b-tooltip target={`${this.id}-attacker-progress`} placement="bottom" class="text-center">
                <HubImg src={this.atkFactionImg} class="hubimg" name="Attacking Faction" width="20px" height="20px" />
                <div class="pl-2">{this.invasion.attacker.factionKey}</div>
              </b-tooltip>
              <b-tooltip target={`${this.id}-defender-progress`} placement="bottom" class="text-center">
                <HubImg src={this.defFactionImg} class="hubimg" name="Defending Faction" width="20px" height="20px" />
                <div class="pl-2">{this.invasion.defender.factionKey}</div>
              </b-tooltip>
            </b-progress>
          </b-row>
        </div>
      );
    } catch (e) {
      console.error('Failed to render InvasionItem');
    }
    return <span />;
  },
};

<template>
  <div class="invasion-container">
    <div :id="`${invasion.id}_info`" class="text-center pb-1">
      <span>
        <b>{{ invasion.node }}</b> - {{ invasion.desc }}
      </span>
    </div>
    <b-row class="invasion-rewards p-0">
      <b-col>
        <div class="pull-left">
          <b-badge v-for="item in atkItems" :key="item" tag="div" :variant="getLabelColor(atkFaction)" class="ml-n3">
            <item-thumb :alt="item" />
          </b-badge>
          <b-badge
            v-for="item in atkCntItems"
            :key="item.type"
            tag="div"
            :variant="getLabelColor(atkFaction)"
            class="ml-n3"
          >
            <item-thumb :alt="countedItem(item)" :ikey="item.key" />
          </b-badge>
        </div>
        <div class="pull-right">
          <b-badge v-for="item in defItems" :key="item" :variant="getLabelColor(defFaction)" class="mr-n3">
            <item-thumb :alt="item" />
          </b-badge>
          <b-badge v-for="item in defCntItems" :key="item.type" :variant="getLabelColor(defFaction)" class="mr-n3">
            <item-thumb :alt="countedItem(item)" :ikey="item.key" />
          </b-badge>
        </div>
      </b-col>
    </b-row>
    <b-row class="invasion-progress">
      <b-progress :max="100" class="w-100 h-125">
        <b-progress-bar
          :id="`${id}-attacker-progress`"
          :variant="getLabelColor(invasion.attacker.factionKey)"
          :value="invasion.completion"
          :aria-label="`Current Attacker Progresss: ${invasion.completion}`"
        />
        <b-progress-bar
          :id="`${id}-defender-progress`"
          :variant="getLabelColor(invasion.defender.factionKey)"
          :value="100 - invasion.completion"
          :aria-label="`Current Defender Progresss: ${100 - invasion.completion}`"
        />
        <small class="justify-content-center d-flex position-absolute w-100 progress-value">
          {{ invasion.completion.toFixed(2) }}% - {{ eta(invasion) }}
        </small>
        <b-tooltip :target="`${id}-attacker-progress`" placement="bottom" class="text-center">
          <HubImg :src="atkFactionImg" class="hubimg" name="Attacking Faction" width="20px" height="20px" />
          <div class="pl-2">{{ invasion.attacker.factionKey }}</div>
        </b-tooltip>
        <b-tooltip :target="`${id}-defender-progress`" placement="bottom" class="text-center">
          <HubImg :src="defFactionImg" class="hubimg" name="Defending Faction" width="20px" height="20px" />
          <div class="pl-2">{{ invasion.defender.factionKey }}</div>
        </b-tooltip>
      </b-progress>
    </b-row>
  </div>
</template>

<style scoped>
.invasion-rewards {
  margin-top: -25px;
}

.invasion-rewards {
  pointer-events: none;
}

.invasion-rewards .badge > * {
  pointer-events: auto;
}

.hubimg {
  filter: invert(100%);
}

.hubimg + div {
  display: inline-block;
}

.progress-value {
  margin-top: 9px;
}
</style>

<script>
import HubImg from '@/components/HubImg.vue';
import AsyncItemThumb from '@/components/AsyncItemThumb';
import { makeid, cdn } from '@/services/utilities.js';

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

export default {
  name: 'InvasionItem',
  components: {
    HubImg,
    'item-thumb': AsyncItemThumb,
  },
  props: ['invasion'],
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
      return (
        (this.$props.invasion &&
          this.$props.invasion.attacker &&
          this.$props.invasion.attacker.reward &&
          this.$props.invasion.attacker.reward.items) ||
        []
      );
    },
    atkCntItems() {
      return (
        (this.$props.invasion &&
          this.$props.invasion.attacker &&
          this.$props.invasion.attacker.reward &&
          this.$props.invasion.attacker.reward.countedItems) ||
        []
      );
    },
    defCntItems() {
      return (
        (this.$props.invasion &&
          this.$props.invasion.defender &&
          this.$props.invasion.defender.reward &&
          this.$props.invasion.defender.reward.countedItems) ||
        []
      );
    },
    defItems() {
      return (
        (this.$props.invasion &&
          this.$props.invasion.defender &&
          this.$props.invasion.defender.reward &&
          this.$props.invasion.defender.reward.items) ||
        []
      );
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
    getLabelColor(faction) {
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
    },
    countedItem(item) {
      if (item.count > 1) {
        return `${item.count} ${item.type}`;
      }
      return item.type;
    },
    ongoing(invasions) {
      const ongoingInvasions = [];
      for (let i = 0; i < invasions.length; i++) {
        if (!invasions[i].completed) {
          ongoingInvasions.push(invasions[i]);
        }
      }
      return ongoingInvasions;
    },
  },
};
</script>

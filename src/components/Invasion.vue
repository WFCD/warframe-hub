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
          <b-badge
            tag="div"
            v-for="item in invasion.attacker.reward.items"
            :key="item"
            :variant="getLabelColor(invasion.attacker.factionKey)"
            class="ml-n3"
          >
            <item-thumb :alt="item" />
          </b-badge>
          <b-badge
            tag="div"
            v-for="item in invasion.attacker.reward.countedItems"
            :key="item.type"
            :variant="getLabelColor(invasion.attacker.factionKey)"
            class="ml-n3"
          >
            <item-thumb :alt="countedItem(item)" :ikey="item.key" />
          </b-badge>
        </div>
        <div class="pull-right">
          <b-badge
            v-for="item in invasion.defender.reward.items"
            :key="item"
            :variant="getLabelColor(invasion.defender.factionKey)"
            class="mr-n3"
          >
            <item-thumb :alt="item" />
          </b-badge>
          <b-badge
            v-for="item in invasion.defender.reward.countedItems"
            :key="item.type"
            :variant="getLabelColor(invasion.defender.factionKey)"
            class="mr-n3"
          >
            <item-thumb :alt="countedItem(item)" :ikey="item.key" />
          </b-badge>
        </div>
      </b-col>
    </b-row>
    <b-row class="invasion-progress">
      <b-progress :max="100" class="w-100 h-125">
        <b-progress-bar
          :variant="getLabelColor(invasion.attacker.factionKey)"
          :value="invasion.completion"
          :id="`${this.id}-attacker-progress`"
          :aria-label="`Current Attacker Progresss: ${invasion.completion}`"
        />
        <b-progress-bar
          :variant="getLabelColor(invasion.defender.factionKey)"
          :value="100 - invasion.completion"
          :id="`${this.id}-defender-progress`"
          :aria-label="`Current Defender Progresss: ${100 - invasion.completion}`"
        />
        <small class="justify-content-center d-flex position-absolute w-100 progress-value">
          {{ invasion.completion.toFixed(2) }}% - {{ eta(invasion) }}
        </small>
        <b-tooltip :target="`${this.id}-attacker-progress`" placement="bottom" class="text-center">
          <HubImg :src="atkFactionImg" class="hubimg" name="Attacking Faction" width="20px" height="20px" />
          <div class="pl-2">{{ invasion.attacker.factionKey }}</div>
        </b-tooltip>
        <b-tooltip :target="`${this.id}-defender-progress`" placement="bottom" class="text-center">
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

.eta {
  font-size: 75%;
}

.progress-value {
  margin-top: 9px;
}
</style>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import HubImg from '@/components/HubImg.vue';
import AsyncItemThumb from '@/components/AsyncItemThumb';
import utilities from '@/utilities.js';

import corpus from '@/assets/img/factions/corpus.svg';
import corrupted from '@/assets/img/factions/corrupted.svg';
import grineer from '@/assets/img/factions/grineer.svg';
import infested from '@/assets/img/factions/infested.svg';
import sentient from '@/assets/img/factions/sentient.svg';

export default {
  name: 'Invasion',
  props: ['invasion'],
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      id: utilities.makeid(),
      fImg: {
        corpus: corpus,
        grineer: grineer,
        infested: infested,
        infestation: infested,
        corrupted: corrupted,
        orokin: corrupted,
        sentient: sentient,
      },
    };
  },
  computed: {
    atkFactionImg() {
      return this.fImg[this.$props.invasion.attackingFaction.toLowerCase()] || corrupted;
    },
    defFactionImg() {
      return this.fImg[this.$props.invasion.defendingFaction.toLowerCase()] || corrupted;
    },
  },
  methods: {
    eta: function (invasion) {
      const eta = invasion.eta
        .replace('-Infinityd', '??')
        .replace('Infinityd', '??')
        .replace(/\s\d\d?s/gi, '')
        .trim();
      return `${this.$t('invasions.eta')} ${eta}`;
    },
    getLabelColor: function (faction) {
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
    countedItem: function (item) {
      if (item.count > 1) {
        return `${item.count} ${item.type}`;
      }
      return item.type;
    },
    ongoing: function (invasions) {
      var ongoingInvasions = [];
      for (var i = 0; i < invasions.length; i++) {
        if (!invasions[i].completed) {
          ongoingInvasions.push(invasions[i]);
        }
      }
      return ongoingInvasions;
    },
  },
  components: {
    TimeBadge,
    HubImg,
    'item-thumb': AsyncItemThumb,
  },
};
</script>

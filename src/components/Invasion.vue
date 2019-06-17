<template>
  <div>
    <div :id="`${invasion.id}_info`" class="text-center">
      <span
        ><b>{{ invasion.node }}</b></span
      >
      <b-btn :id="`${invasion.id}_tooltip`" class="pull-right" size="sm" variant="secondary">?</b-btn>
      <b-tooltip :target="`${invasion.id}_tooltip`" placement="top">
        &nbsp;
        <TimeBadge :starttime="invasion.activation" :counter="true" :interval="1000" />
      </b-tooltip>
      <br />
      {{ invasion.desc }} {{ eta(invasion) }}
    </div>
    <b-row>
      <b-col>
        <div class="pull-left">
          <b-badge
            tag="div"
            v-for="item in invasion.attackerReward.items"
            :key="item"
            :variant="getLabelColor(invasion.attackingFaction)"
            >{{ item }}</b-badge
          >
          <b-badge
            tag="div"
            v-for="item in invasion.attackerReward.countedItems"
            :key="item.type"
            :variant="getLabelColor(invasion.attackingFaction)"
            >{{ countedItem(item) }}</b-badge
          >
        </div>
        <div class="pull-right">
          <b-badge
            v-for="item in invasion.defenderReward.items"
            :key="item"
            :variant="getLabelColor(invasion.defendingFaction)"
            >{{ item }}</b-badge
          >
          <b-badge
            v-for="item in invasion.defenderReward.countedItems"
            :key="item.type"
            :variant="getLabelColor(invasion.defendingFaction)"
            >{{ countedItem(item) }}</b-badge
          >
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-progress :max="100" class="w-100 h-125">
        <b-progress-bar
          :variant="getLabelColor(invasion.attackingFaction)"
          :value="invasion.completion"
        ></b-progress-bar>
        <b-progress-bar
          :variant="getLabelColor(invasion.defendingFaction)"
          :value="100 - invasion.completion"
        ></b-progress-bar>
      </b-progress>
    </b-row>
  </div>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';

export default {
  name: 'Invasion',
  props: ['invasion'],
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
    };
  },
  methods: {
    eta: function(invasion) {
      return `(Ends in: ${invasion.eta
        .replace('-Infinityd', '??')
        .replace('Infinityd', '??')
        .replace(/\s\d\d?s/gi, '')})*`;
    },
    getLabelColor: function(faction) {
      switch (faction) {
        case 'Corpus':
          return 'info';
        case 'Grineer':
          return 'danger';
        case 'Infested':
          return 'success';
        case 'Corrupted':
          return 'warning';
        default:
          return 'default';
      }
    },
    countedItem: function(item) {
      if (item.count > 1) {
        return `${item.count} ${item.type}`;
      }
      return item.type;
    },
    ongoing: function(invasions) {
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
  },
};
</script>

<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item :style="styleObject" v-for="(invasion, index) in invasions" :key="invasion.id"
      v-bind:class="{
        'list-group-item-borderless': index !== invasions.length - 1,
        'list-group-item-borderbottom': index === invasions.length - 1 }"
        v-if="!invasion.completed">

        <div :id="`${invasion.id}_info`" class="text-center">
          <span><b>{{invasion.node}}</b></span>
          <br/>
          {{invasion.desc}} {{eta(invasion)}}
        </div>
        <b-row>
          <div class="pull-left">
            <b-badge tag="div" v-for="item in invasion.attackerReward.items" :key="item" :variant="getLabelColor(invasion.attackingFaction)">{{item}}</b-badge>
            <b-badge tag="div" v-for="item in invasion.attackerReward.countedItems" :key="item.type" :variant="getLabelColor(invasion.attackingFaction)">{{countedItem(item)}}</b-badge>
          </div>
          <div class="pull-right">
            <b-badge v-for="item in invasion.defenderReward.items" :key="item" :variant="getLabelColor(invasion.defendingFaction)">{{item}}</b-badge>
            <b-badge v-for="item in invasion.defenderReward.countedItems" :key="item.type" :variant="getLabelColor(invasion.defendingFaction)">{{countedItem(item)}}</b-badge>
          </div>
        </b-row>
        <b-row>
          <b-progress :max="100" class="w-100 h-125">
            <b-progress-bar :variant="getLabelColor(invasion.attackingFaction)" :value="invasion.completion" animated></b-progress-bar>
            <b-progress-bar :variant="getLabelColor(invasion.defendingFaction)" :value="100 - invasion.completion" animated></b-progress-bar>
          </b-progress>
        </b-row>
      </b-list-group-item>
      <NoDataItem v-if="invasions.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
  import TimeBadge from '@/components/TimeBadge.vue';
  import HubImg from '@/components/HubImg.vue';
  import NoDataItem from '@/components/NoDataItem.vue';
  import HubPanelWrap from '@/components/HubPanelWrap';

  export default {
    name: 'InvasionsPanel',
    props: ['invasions'],
    computed: {
      headertext() {
        return 'Invasions';
      },
    },
    data () {
      return {
        styleObject: {
          display: 'inline',
        },
      };
    },
    methods: {
      eta: function(invasion) {
        return `(Ends in: ${invasion.eta.replace('-Infinityd', '??').replace('Infinityd', '??').replace(/\s\d\d?s/ig, '')})*`;
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
    },
    components: {
      TimeBadge,
      HubImg,
      NoDataItem,
      HubPanelWrap,
    }
  };
</script>

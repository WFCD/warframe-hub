<template>
  <HubPanelWrap :title="headertext" class="invasions" :class="{ 'no-content': invasions.length === 0 }">
    <b-list-group>
      <b-list-group-item
        :style="styleObject"
        v-for="(invasion, index) in ongoing(invasions).splice(0, maxInvasions)"
        :key="invasion.id"
        v-bind:class="{
          'list-group-item-borderless': index < ongoing(invasions).length - 1,
          'list-group-item-borderbottom': index === ongoing(invasions).length - 1,
        }"
      >
        <Invasion :invasion="invasion"></Invasion>
      </b-list-group-item>
      <b-list-group-item
        class="list-group-item-borderbottom"
        v-if="ongoing(invasions).length > maxInvasions"
        style="padding:0;"
      >
        <Spoiler :init="initialStatus" @toggle="updatePanelStatus()">
          <b-list-group>
            <b-list-group-item
              :style="styleObject"
              v-for="(invasion, index) in ongoing(invasions).splice(maxInvasions)"
              :key="invasion.id"
              v-bind:class="{
                'list-group-item-borderless': index < ongoing(invasions).length - 1,
                'list-group-item-borderbottom': index === ongoing(invasions).length - 1,
              }"
            >
              <Invasion :invasion="invasion"></Invasion>
            </b-list-group-item>
          </b-list-group>
        </Spoiler>
      </b-list-group-item>
      <NoDataItem v-if="invasions.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import Spoiler from '@/components/Spoiler';
import Invasion from '@/components/Invasion';

export default {
  name: 'InvasionsPanel',
  props: ['invasions'],
  computed: {
    headertext() {
      return 'Invasions';
    },
    maxInvasions() {
      return 5;
    },
    initialStatus() {
      const state = this.$store.getters.componentState.invasions;
      return state.expand;
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
    };
  },
  methods: {
    ongoing: function(invasions) {
      return invasions.filter((invasion) => !invasion.completed);
    },
    updatePanelStatus: function() {
      const state = this.$store.getters.componentState['invasions'];
      state.expand = !state.expand;
      this.$store.commit('commitComponent', ['invasions', state]);
    },
  },
  components: {
    Invasion,
    Spoiler,
    NoDataItem,
    HubPanelWrap,
  },
};
</script>

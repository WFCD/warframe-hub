<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item :style="styleObject" v-for="(invasion, index) in ongoing(invasions).splice(0,maxInvasions)" :key="invasion.id"
      v-bind:class="{
        'list-group-item-borderless': index < (ongoing(invasions).length - 1),
        'list-group-item-borderbottom': index === (ongoing(invasions).length - 1) }">
        <Invasion :invasion="invasion"></Invasion>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom" v-if="ongoing(invasions).length>maxInvasions" style="padding:0;">
        <Spoiler :init="initialStatus" @toggle='updatePanelStatus()'>
          <b-list-group>
            <b-list-group-item :style="styleObject" v-for="(invasion, index) in ongoing(invasions).splice(maxInvasions)" :key="invasion.id"
              v-bind:class="{
                'list-group-item-borderless': index < (ongoing(invasions).length - 1),
                'list-group-item-borderbottom': index === (ongoing(invasions).length - 1) }">
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
        var state = this.$store.getters.componentState['invasions'];
        return state.expand;
      }
    },
    data () {
      return {
        styleObject: {
          display: 'inline',
        },
      };
    },
    methods: {
      ongoing: function(invasions) {
        var ongoingInvasions = [];
        for (var i = 0; i < invasions.length; i++) {
          if (!invasions[i].completed) {
            ongoingInvasions.push(invasions[i]);
          }
        }
        return ongoingInvasions;
      },
      updatePanelStatus: function() {
        var state = this.$store.getters.componentState['invasions'];
        state.expand= !state.expand;
        // eslint-disable-next-line no-console
        console.log(state);
        this.$store.commit('commitComponent', ['invasions', state]);
      }
    },
    components: {
      Invasion,
      Spoiler,
      NoDataItem,
      HubPanelWrap,
    }
  };
</script>

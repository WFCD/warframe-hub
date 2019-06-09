<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item :style="styleObject" v-for="(invasion, index) in ongoing(invasions).splice(0,maxInvasions)" :key="invasion.id"
      v-bind:class="{
        'list-group-item-borderless': index < (ongoing(invasions).length - 1),
        'list-group-item-borderbottom': index === (ongoing(invasions).length - 1) }">
        <Invasion :invasion="invasion"></Invasion>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom" v-if="ongoing(invasions).length>2">
        <Collapsible :headertext="`Show More (${ongoing(invasions).length-maxInvasions})`">
          <b-list-group>
            <b-list-group-item :style="styleObject" v-for="(invasion, index) in ongoing(invasions).splice(maxInvasions)" :key="invasion.id"
              v-bind:class="{
                'list-group-item-borderless': index < (ongoing(invasions).length - 1),
                'list-group-item-borderbottom': index === (ongoing(invasions).length - 1) }">
                <Invasion :invasion="invasion"></Invasion>
            </b-list-group-item>
          </b-list-group>
        </Collapsible>
      </b-list-group-item>
      <NoDataItem v-if="invasions.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
  import NoDataItem from '@/components/NoDataItem.vue';
  import HubPanelWrap from '@/components/HubPanelWrap';
  import Collapsible from '@/components/Collapsible';
  import Invasion from '@/components/Invasion';

  export default {
    name: 'InvasionsPanel',
    props: ['invasions'],
    computed: {
      headertext() {
        return 'Invasions';
      },
      maxInvasions() {
        return 5
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
      }
    },
    components: {
      Invasion,
      Collapsible,
      NoDataItem,
      HubPanelWrap,
    }
  };
</script>

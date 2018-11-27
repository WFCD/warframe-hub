<template>
  <b-col md="6" class="panel-header">
    <h3 class="text-center">{{headertext}}</h3>
    <b-list-group>
      <b-list-group-item :style="styleObject" v-for="(acolyte, index) in acolytes" :key="acolyte.id" v-bind:class="{ 'list-group-item-borderless': index !== acolytes.length - 1, 'list-group-item-borderbottom': index === acolytes.length - 1 }">
        <span :class="`label label-${healthLabel(acolyte)} pull-right`"><span :id="`${acolyte.id}-health`">{{health(acolyte)}}</span>% <i class="fas fa-heartbeat" title="Health Remaining" style="margin-left: 5px"></i></span>

        <b>
          <i class="far fa-eye faIconStyle" :title="`${acolyte.agentType} Discovered`" :style="acolyteIcons" v-if="acolyte.isRequired"></i>
          <i class="far fa-eye-slash faIconStyle" :title="`${acolyte.agentType} Discovered`" :style="acolyteIcons" v-else></i>
          {{acolyte.agentType}}
        </b>
        <br />
        <div style="margin-top:2px">
          <b>
            <span :id="`${acolyte.id}-loc`">{{acolyte.isDiscovered ? '' : 'Last '}} @ {{acolyte.lastDiscoveredAt}}</span>
          </b> | <b>Level: </b>{{acolyte.rank}}
          <b-badge :id="`${acolyte.id}-lastDicoveredTime`" variant="info" class="pull-right timebadage">{{moment(acolyte.lastDiscoveredTime).fromNow()}}</b-badge>
        </div>
      </b-list-group-item>
      <NoDataItem v-if="acolytes.length === 0" :text="headertext" />
    </b-list-group>
  </b-col>
</template>

<script>
  import NoDataItem from '@/components/NoDataItem.vue';
  import moment from 'moment';

  export default {
    name: 'AcolytesPanel',
    props: ['acolytes'],
    computed: {
      headertext() {
        return 'Acolytes';
      },
      health(acolyte) {
        return (acolyte.healthPercent * 100).toFixed(2);
      },
      healthLabel(acolyte) {
        const health = this.health(acolyte);
        let labelClass = 'success';
        if (health <= 80 && health > 50) {
          labelClass = 'info';
        } else if (health <= 50 && health > 20) {
          labelClass = 'warning';
        } else if (health <= 20) {
          labelClass = 'danger';
        }
      }
    },
    data () {
      return {
        styleObject: {
          display: 'inline',
        },
        acolyteIcons: {
          'margin-right': '10px',
        }
      };
    },
    components: {
      NoDataItem,
    }
  };
</script>

<template>
  <b-col md="6">
    <h3 class="text-center">{{headertext}}</h3>
    <b-list-group>
      <b-list-group-item :style="styleObject" v-for="alert in alerts" :key="alert.id" class="list-group-item-borderless">
        <span class="pull-left">
          <HubImg :src="archwing" name="Archwing Required for Mission" :style="missionType" v-if="alert.archwingRequired" />
          <HubImg :src="nightmare" name="Nightmare Mission" :style="missionType" v-if="alert.nightmare" />
          <b>{{alert.mission.node}}</b>
        </span>
        <TimeBadge :starttime="alert.activation" :endtime="alert.expiry" :interval="1000"/>
        <b-badge
          variant="info"
          :style="styleObject"
          v-for="item in alert.mission.reward.items"
          :key="item"
          class="pull-right"
        >{{item}}</b-badge>
        <br />
        <b-badge variant="info" :style="styleObject" class="pull-right">{{ alert.mission.reward.credits }}cr</b-badge>
        <div style="margin-top:2px" class="pull-left">
          <b>{{alert.mission.type}}</b> ({{alert.mission.faction}}) | <b>Level: </b>{{ alert.mission.minEnemyLevel }}-{{ alert.mission.maxEnemyLevel }}
        </div>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom">
      </b-list-group-item>
    </b-list-group>
  </b-col>
</template>

<script>
  import TimeBadge from '@/components/TimeBadge.vue';
  import HubImg from '@/components/HubImg.vue';

  import archwing from '@/assets/img/archwing.svg';
  import nightmare from '@/assets/img/nightmare.svg';

  export default {
    name: 'AlertPanel',
    props: ['alerts'],
    computed: {
      headertext() {
        return 'Alerts';
      }
    },
    data () {
      return {
        styleObject: {
          display: 'inline',
        },
        archwing: archwing,
        nightmare: nightmare,
        missionType: {
          'filter': 'invert(100%)',
          'margin-top': '-3px',
          'margin-right': '5px',
          'width': '15px',
          'height': '15px',
        },
      };
    },
    components: {
      TimeBadge,
      HubImg
    }
  };
</script>
<!-- AlertPanel.vue -->

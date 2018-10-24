<template>
<b-col md="6">
  <h3 class="text-center">{{headertext}}</h3>
  <b-list-group style="width: 100%">
    <b-list-group-item :style="styleObject" class="list-group-item-borderless">
      <span class="pull-left">
        <b>Currently it is:</b>
      </span>
      <b-badge class="pull-right" style="margin-right: 5px" variant="dark"><span v-if="time.isDay">Day</span><span v-else>Night</span></b-badge>
    </b-list-group-item>
    <b-list-group-item :style="styleObject" class="list-group-item-borderless">
      <span class="pull-left">
        <b>Time until <span v-if="!time.isDay">Day</span><span v-else>Night</span>: </b>
      </span>
      <b-badge variant="info" :style="styleObject" class="pull-right" style="margin-right: 5px">{{time.timeLeft}}</b-badge>
    </b-list-group-item>
    <b-list-group-item :style="styleObject" class="list-group-item-borderless">
      <span class="pull-left">
        <b>Time at <span v-if="!time.isDay">Day</span><span v-else>Night</span>:</b>
      </span>
      <b-badge variant="info" :style="styleObject" class="pull-right" style="margin-right: 5px">{{earthtimezonetime}}</b-badge>
    </b-list-group-item>
    <b-list-group-item class="list-group-item-borderbottom">
    </b-list-group-item>
  </b-list-group>
</b-col>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['time', 'location'],
    name: 'TimePanel',
    computed: {
      earthtimezonetime() {
        return moment(this.$props.time.expiryTime).format('llll')
      },
      headertext() {
        return this.$props.location + ' Day/Night Cycle'
      }
    },
    data() {
      return {
        styleObject: {
          display: 'inline'
        },
      }
    },
  }
</script>

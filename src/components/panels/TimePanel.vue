<template>
<b-col md="6">
  <h3 class="text-center">{{headertext}}</h3>
  <b-list-group>
    <b-list-group-item :style="styleObject" class="list-group-item-borderless">
      <span class="pull-left">
        <b>Currently it is:</b>
      </span>
      <b-badge v-if="time.isDay" class="pull-right timebadage" variant="success">Day</b-badge>
      <b-badge v-else class="pull-right timebadage" variant="dark">Night</b-badge>
    </b-list-group-item>
    <b-list-group-item :style="styleObject" class="list-group-item-borderless">
      <span class="pull-left">
        <b>Time until <span v-if="!time.isDay">Day</span><span v-else>Night</span>: </b>
      </span>
      <b-badge variant="info" :style="styleObject" class="pull-right timebadage">{{time.timeLeft}}</b-badge>
    </b-list-group-item>
    <b-list-group-item :style="styleObject" class="list-group-item-borderless">
      <span class="pull-left">
        <b>Time at <span v-if="!time.isDay">Day</span><span v-else>Night</span>:</b>
      </span>
      <b-badge variant="info" :style="styleObject" class="pull-right timebadage" >{{earthtimezonetime}}</b-badge>
    </b-list-group-item>
    <b-list-group-item class="list-group-item-borderbottom">
    </b-list-group-item>
  </b-list-group>
</b-col>
</template>
<style scoped>
.timebadage {
  margin-right: 5px
}
</style>
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

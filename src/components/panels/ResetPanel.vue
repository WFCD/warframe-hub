<template>
<b-col md="6">
  <h3 class="text-center">{{headertext}}</h3>
  <b-list-group>
    <b-list-group-item :style="styleObject" class="list-group-item-borderless">
      <span class="pull-left">
        <b>Currently it is:</b>
      </span>
      <TimeBadge :starttime="this.time2" :endtime="this.time1"/>
    </b-list-group-item>
  </b-list-group>
</b-col>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue'
import moment from 'moment'

export default {
  props: ['time', 'location'],
  name: 'TimePanel',
  computed: {
    headertext() {
      return 'Daily Reward Timer reset'
    }
  },
  data() {
    return {
      time1: moment().toISOString(),
      time2: moment().endOf('day').add(1,"seconds").toISOString(),
      styleObject: {
        display: 'inline'
      }
    }
  },
  mounted() {
    this.gettime()
  },
  methods: {
    gettime: function() {
      this.time2 = moment().toISOString();
      this.time1 = moment().endOf('day').add(1,"seconds").toISOString()
    }
  },
  components: {
    TimeBadge
  }
}
</script>

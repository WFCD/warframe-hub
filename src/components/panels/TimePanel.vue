<template>
  <HubPanelWrap :title="headertext" class="time" :class="[location.toLowerCase()]">
    <b-list-group>
      <b-list-group-item :style="styleObject" class="list-group-item-borderbottom">
        <div class="row">
          <div class="col-md-9">
            <span
              class="pull-left"
              v-bind:class="{
                day: time.state == 'day',
                night: time.state == 'night',
                warm: time.state == 'warm',
                cold: time.state == 'cold',
              }"
            >
              <span style="text-transform: capitalize;">{{ time.state }}</span>
            </span>
          </div>
          <div class="col-md-3">
            <TimeBadge :starttime="now" :endtime="time.expiry" :interval="1000" />
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import moment from 'moment';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  props: ['time', 'location'],
  name: 'TimePanel',
  computed: {
    now() {
      return moment().toISOString();
    },
    headertext() {
      return `${this.$props.location} Cycle Timer`;
    },
  },
  components: {
    TimeBadge,
    HubPanelWrap,
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
    };
  },
};
</script>

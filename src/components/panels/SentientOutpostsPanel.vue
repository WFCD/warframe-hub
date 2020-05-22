<template>
  <HubPanelWrap :title="headertext" class="sentientoutpost">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom" v-if="sentientOutposts.active">
        <span class="pull-left">
          <HubImg :src="sentient" :name="this.$t('factions.sentient')" :style="factionImg" width="20px" height="20px" />
          <b>{{ sentientOutposts.mission.node }}</b> - {{ sentientOutposts.mission.faction }} -
          {{ sentientOutposts.mission.type }}
          <i id="para_tooltip" class="fa-xs fas fa-exclamation-triangle"></i>
          <b-tooltip target="para_tooltip" placement="top" class="text-center">
            {{ $t('sentientoutpost.warn') }}
          </b-tooltip>
          <i id="time_tooltip" class="fa-xs fas fa-question-circle"></i>
          <b-tooltip target="time_tooltip" placement="top" class="text-center">
            {{ $t('sentientoutpost.tooltip1') }}
            {{ $t('sentientoutpost.tooltip2') }}
          </b-tooltip>
        </span>
        <TimeBadge :starttime="sentientOutposts.activation" :endtime="sentientOutposts.expiry" :interval="1000" />
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom p-2" v-if="!sentientOutposts.active">
        <span class="pull-left">
          <i class="far fa-eye-slash faIcon" v-b-tooltip :title="this.$t('sentientoutpost.none')"></i>
          <b>{{ $t('sentientoutpost.none') }}</b>
        </span>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import HubImg from '@/components/HubImg.vue';

import sentient from '@/assets/img/factions/sentient.svg';

export default {
  name: 'SentientOutpostsPanel',
  props: ['sentientOutposts'],
  watch: {
    mission: function () {
      this.active = new Date().getTime();
    },
  },
  computed: {
    headertext() {
      return this.$t('sentientoutpost.header');
    },
  },
  data() {
    return {
      sentient: sentient,
      factionImg: {
        filter: 'invert(100%)',
        'margin-top': '-3px',
        'margin-right': '5px',
        width: '25px',
        height: '25px',
      },
      mission: this.$props.sentientOutposts.mission.node,
    };
  },
  components: {
    HubPanelWrap,
    TimeBadge,
    HubImg,
  },
  methods: {
    now() {
      return new Date().toString();
    },
  },
};
</script>

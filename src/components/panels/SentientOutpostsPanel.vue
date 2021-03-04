<template>
  <HubPanelWrap :title="headertext" class="sentientoutpost">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom" v-if="sentientOutposts.active">
        <span class="pull-left">
          <HubImg
            id="para_tooltip"
            :src="sentient"
            :name="this.$t('factions.sentient') + ' | ' + this.$t('sentientoutpost.warn')"
            :style="factionImg"
            width="20px"
            height="20px"
          />
          {{ sentientOutposts.mission.node }}
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
      this.active = Date.now();
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

<template>
  <HubPanelWrap :title="headertext" class="sentientoutpost">
    <b-list-group>
      <b-list-group-item v-if="active" class="list-group-item-borderbottom">
        <span class="pull-left">
          <HubImg
            id="para_tooltip"
            :src="sentient"
            :name="$t('factions.sentient') + ' | ' + $t('sentientoutpost.warn')"
            :style="factionImg"
            width="20px"
            height="20px"
          />
          {{ mission }}
        </span>
      </b-list-group-item>
      <b-list-group-item v-if="!active" class="list-group-item-borderbottom p-2">
        <span class="pull-left">
          <i v-b-tooltip class="far fa-eye-slash faIcon" :title="$t('sentientoutpost.none')"></i>
          <b>{{ $t('sentientoutpost.none') }}</b>
        </span>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import HubPanelWrap from '@/components/HubPanelWrap';
import HubImg from '@/components/HubImg.vue';
import { cdn } from '@/services/utilities';

const sentient = cdn('svg/factions/sentient.svg');

export default {
  name: 'SentientOutpostsPanel',
  components: {
    HubPanelWrap,
    HubImg,
  },
  props: ['sentientOutposts'],
  data() {
    return {
      sentient,
      factionImg: {
        filter: 'invert(100%)',
        'margin-top': '-3px',
        'margin-right': '5px',
        width: '25px',
        height: '25px',
      },
      mission:
        (this.$props.sentientOutposts &&
          this.$props.sentientOutposts.mission &&
          this.$props.sentientOutposts.mission.node) ||
        'Fight',
      active: this.$props.sentientOutposts.active,
    };
  },
  computed: {
    headertext() {
      return this.$t('sentientoutpost.header');
    },
  },
  watch: {
    mission() {
      this.active = Date.now();
    },
  },
};
</script>

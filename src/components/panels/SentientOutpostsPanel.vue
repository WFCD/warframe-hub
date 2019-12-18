<template>
  <HubPanelWrap :title="headertext" class="sentientoutpost">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom" v-if="sentientOutposts.active">
        Sentient Outpost Active at {{ sentientOutposts.mission }}
        <b-btn id="beta_tooltip" class="pull-right py-0" size="sm" variant="primary">!</b-btn>
        <b-tooltip target="beta_tooltip" placement="top" class="text-center">
          This component is in active development because of the recent update.
          <br />
          Estimated cycle is 30 minutes of active time and 3 hours of inactive time.
        </b-tooltip>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderlessbottom p-0" v-if="!sentientOutposts.active">
        <b-btn id="beta_tooltip" class="pull-right py-0" size="sm" variant="primary">!</b-btn>
        <b-tooltip target="beta_tooltip" placement="top" class="text-center">
          This component is in active development because of the recent update.
          <br />
          Estimated cycle is 30 minutes of active time and 3 hours of inactive time.
        </b-tooltip>
      </b-list-group-item>
      <NoDataItem v-if="!sentientOutposts.active == null" text="Outposts" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import NoDataItem from '@/components/NoDataItem.vue';

export default {
  name: 'SentientOutpostsPanel',
  props: ['sentientOutposts'],
  computed: {
    headertext() {
      return 'Sentient Outposts (Beta)';
    },
  },
  components: {
    HubPanelWrap,
    TimeBadge,
    NoDataItem,
  },
  methods: {
    now() {
      return new Date().toString();
    },
  },
};
</script>

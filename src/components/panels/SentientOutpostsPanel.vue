<template>
  <HubPanelWrap :title="headertext" class="sentientoutpost">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderbottom" v-if="sentientOutposts.active">
        <b>{{ sentientOutposts.mission.node }}</b> - {{ sentientOutposts.mission.faction }} -
        {{ sentientOutposts.mission.type }}
        <b-btn id="beta_tooltip" class="pull-right py-0" size="sm" variant="primary">!</b-btn>
        <b-tooltip target="beta_tooltip" placement="top" class="text-center">
          {{ $t('sentientoutpost.tooltip1') }}
          <br />
          {{ $t('sentientoutpost.tooltip2') }}
        </b-tooltip>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderlessbottom p-0" v-if="!sentientOutposts.active">
        <b-btn id="beta_tooltip" class="pull-right py-0" size="sm" variant="primary">!</b-btn>
        <b-tooltip target="beta_tooltip" placement="top" class="text-center">
          {{ $t('sentientoutpost.tooltip1') }}
          <br />
          {{ $t('sentientoutpost.tooltip2') }}
        </b-tooltip>
      </b-list-group-item>
      <NoDataItem v-if="!sentientOutposts.active" :text="$t('sentientoutpost.outpostsL')" />
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
      return this.$t('sentientoutpost.header');
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

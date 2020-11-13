<template>
  <HubPanelWrap :title="headertext" class="bounties">
    <b-list-group>
      <b-list-group-item v-if="syndicate && syndicate.active" class="list-group-item-borderless">
        <span class="pull-left">{{ $t('bounty.expires') }}</span>
        <TimeBadge :starttime="syndicate.activation" :endtime="syndicate.expiry" :interval="1000" />
        <b-table
          selectable
          :fields="this.fields"
          :items="this.items"
          class="item-table"
          @row-clicked="toggleDetails"
          :ref="`${this.typeId}-table`"
        >
          <template v-slot:cell(type)="data">
            <div>
              <div @click="data.toggleDetails" size="sm" class="ml-2 pull-left">
                <i v-if="data.detailsShowing" class="fas fa-chevron-down"></i>
                <i v-else class="fas fa-chevron-right"></i>
              </div>
              <div class="text-center">{{ data.value }}</div>
            </div>
          </template>
          <template v-slot:head(standing)="data">
            <HubImg
              :src="standing"
              :name="data.label"
              width="24px"
              height="24px"
              class="text-center li-mission-decorator li-mission-decorator-lg"
            />
          </template>
          <template v-slot:cell(standing)="row">
            {{ row.item.standing }}
          </template>
          <template v-slot:cell(moreinfo)="row">
            <div @click="row.toggleDetails" size="sm" class="mr-2">
              <i v-if="row.detailsShowing" class="fas fa-chevron-down"></i>
              <i v-else class="fas fa-chevron-right"></i>
            </div>
          </template>
          <template v-slot:row-details="row">
            <span>
              <b-badge v-for="(reward, index) in row.item.rewards" :key="`reward-${type}-${index}`">{{
                reward
              }}</b-badge>
            </span>
          </template>
        </b-table>
      </b-list-group-item>
      <b-list-group-item v-if="syndicate && syndicate.active" class="list-group-item-borderbottom">
        <b-form-checkbox
          :id="`${this.typeId}-bounty-reward-checkbox`"
          class="float-right"
          name="bounty-reward-checkbox"
          switch
          v-model="check"
        >
          {{ this.$t('bounty.autoExpand') }}
        </b-form-checkbox>
      </b-list-group-item>
      <NoDataItem v-else :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<style scoped>
.list-group-item-borderless {
  padding-bottom: 0;
}
.list-group-item-borderbottom {
  padding-top: 0;
}
.table {
  margin-bottom: 0.5em;
}
</style>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import NoDataItem from '@/components/NoDataItem.vue';
import HubImg from '@/components/HubImg.vue';
import HubPanelWrap from '@/components/HubPanelWrap';

import standing from '@/assets/img/general/standing.svg';

import utilities from '@/utilities.js';

export default {
  name: 'BountyPanel',
  props: ['syndicate', 'type'],
  computed: {
    headertext() {
      return this.$t('bounty.header', { type: this.$t(`timer.${this.typeId}`) });
    },
    items: function () {
      return (this.syndicate || { jobs: [] }).jobs.map((job) => ({
        type: job.type,
        standing: job.standingStages.reduce((a, b) => a + b) || 0,
        'level-range': `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
        rewards: job.rewardPool || [],
        _showDetails: this.check,
      }));
    },
    check: {
      get() {
        return this.autoExpand;
      },
      set() {
        this.hover = null;
        this.autoExpand = !this.autoExpand;
        this.$store.commit('toggleBountiesOpen', [this.typeId, this.autoExpand]);
      },
    },
  },
  data() {
    return {
      fields: [
        {
          key: 'type',
          label: this.$t('bounty.type'),
        },
        {
          key: 'standing',
          label: this.$t('bounty.standing'),
          thClass: 'text-center',
        },
        {
          key: 'level-range',
          label: this.$t('bounty.lrange'),
        },
      ],
      standing: standing,
      id: utilities.makeid(),
      typeId: this.type.toLowerCase().replace(/\s/gi, '-'),
      autoExpand: false,
    };
  },
  beforeMount() {
    this.autoExpand = this.$store.getters.bountyToggles[this.typeId];
  },
  methods: {
    toggleDetails(row) {
      row._showDetails = !row._showDetails;
    },
  },
  components: {
    TimeBadge,
    NoDataItem,
    HubImg,
    HubPanelWrap,
  },
};
</script>

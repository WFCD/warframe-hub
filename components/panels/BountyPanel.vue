<template>
  <HubPanelWrap :title="headertext" class="bounties">
    <b-list-group>
      <b-list-group-item v-if="syndicate && syndicate.active" class="list-group-item-borderless">
        <span class="pull-left">{{ $t('bounty.expires') }}</span>
        <TimeBadge :starttime="syndicate.activation" :endtime="syndicate.expiry" :interval="1000" />
        <b-table
          :ref="`${typeId}-table`"
          selectable
          :fields="fields"
          :items="items"
          class="item-table"
          @row-clicked="toggleDetails"
        >
          <template #cell(type)="data">
            <div>
              <div size="sm" class="ml-2 pull-left" @click="data.toggleDetails">
                <i v-if="data.detailsShowing" class="fas fa-chevron-down"></i>
                <i v-else class="fas fa-chevron-right"></i>
              </div>
              <div class="text-center">{{ data.value }}</div>
            </div>
          </template>
          <template #head(standing)="data">
            <HubImg
              :src="standing"
              :name="data.label"
              width="24px"
              height="24px"
              class="text-center li-mission-decorator li-mission-decorator-lg"
            />
          </template>
          <template #cell(standing)="row">
            {{ row.item.standing }}
          </template>
          <template #row-details="row">
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
          :id="`${typeId}-bounty-reward-checkbox`"
          v-model="check"
          class="float-right"
          name="bounty-reward-checkbox"
          switch
        >
          {{ $t('bounty.autoExpand') }}
        </b-form-checkbox>
      </b-list-group-item>
      <NoDataItem v-else :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import { mapGetters } from 'vuex';
import TimeBadge from '@/components/TimeBadge.jsx';
import NoDataItem from '@/components/NoDataItem.jsx';
import HubImg from '@/components/HubImg.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';

import { cdn, makeid } from '@/services/utilities.js';

const standing = cdn('svg/standing.svg');

export default {
  name: 'BountyPanel',
  components: {
    TimeBadge,
    NoDataItem,
    HubImg,
    HubPanelWrap,
  },
  props: {
    syndicate: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: () => 'Syndicate',
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
      standing,
      id: makeid(),
      typeId: this.type.toLowerCase().replace(/\s/gi, '-'),
      autoExpand: false,
    };
  },
  computed: {
    headertext() {
      return this.$t('bounty.header', { type: this.$t(`timer.${this.typeId}`) });
    },
    items() {
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
        this.$store.commit('worldstate/toggleBountiesOpen', [this.typeId, this.autoExpand]);
      },
    },
    ...mapGetters('worldstate', ['bountyToggles']),
  },
  beforeMount() {
    this.autoExpand = this.bountyToggles[this.typeId];
  },
  methods: {
    toggleDetails(row) {
      row._showDetails = !row._showDetails;
    },
  },
};
</script>

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

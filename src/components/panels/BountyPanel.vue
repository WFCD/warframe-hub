<template>
  <HubPanelWrap :title="headertext" class="bounties">
    <b-list-group>
      <b-list-group-item v-if="syndicate && syndicate.active" class="list-group-item-borderbottom">
        <span class="pull-left">Bounties expire in:</span>
        <TimeBadge :starttime="syndicate.activation" :endtime="syndicate.expiry" :interval="1000" />
        <Collapsible :headertext="`${headertext} Bounties`">
          <b-table responsive :fields="this.fields" :items="this.items" class="b-table bounty-table">
            <span slot="rewards" slot-scope="data">
              <b-badge v-for="(reward, index) in data.value" :key="`reward-${type}-${index}`">{{ reward }}</b-badge>
            </span>
            <template slot="HEAD_standing">
              <HubImg
                :src="standing"
                :name="this.$t('bounty.standing')"
                width="24px"
                height="24px"
                class="text-center li-mission-decorator li-mission-decorator-lg"
              />
            </template>
          </b-table>
        </Collapsible>
      </b-list-group-item>
      <NoDataItem v-else :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import NoDataItem from '@/components/NoDataItem.vue';
import HubImg from '@/components/HubImg.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import Collapsible from '@/components/Collapsible';

import standing from '@/assets/img/general/standing.svg';

export default {
  name: 'BountyPanel',
  props: ['syndicate', 'type'],
  computed: {
    headertext() {
      return `${this.type} ${this.$t('bounty.header')}`;
    },
    items: function() {
      return (this.syndicate || { jobs: [] }).jobs.map((job) => ({
        type: job.type,
        standing: job.standingStages.join(', '),
        'level-range': `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
        rewards: job.rewardPool || [],
      }));
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
        {
          key: 'rewards',
          label: this.$t('bounty.rewards'),
        },
      ],
      standing: standing,
    };
  },
  components: {
    Collapsible,
    TimeBadge,
    NoDataItem,
    HubImg,
    HubPanelWrap,
  },
};
</script>

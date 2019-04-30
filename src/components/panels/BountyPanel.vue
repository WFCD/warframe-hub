<template>
  <div class=" max-w-md   h-auto rounded overflow-hidden  border-transparent">
    <div class="font-bold text-default text-4xl mt-1 bg-transparent ">
      {{ headertext }}
    </div>
    <div class=" text-default w-full bg-bgnew shadow-lg ">
      <div class="flex justify-between mx-2 pt-1 mb-1" v-if="syndicate.active">
        <span class="pull-left">Bounties expire in:</span>
        <TimeBadge
          :starttime="syndicate.activation"
          :endtime="syndicate.expiry"
          :interval="1000"
        />
      </div>
      <div
        v-if="syndicate.active"
        class=" bg-bgnew list-group-item-borderbottom"
      >
        <Accordion :title="`${headertext} Bounties`">
          <div class="flex text-white border-b border-black text-bold">
            <div class="w-1/4 bg-bgnew  mr-1 h-6">Type</div>
            <div class="w-1/4 bg-bgnew text-center  mr-1 h-6">
              Standing
            </div>
            <div class="w-1/4 bg-bgnew  mr-1 h-6">
              Level Range
            </div>
            <div class="w-1/4 bg-bgnew h-6">Rewards</div>
          </div>
          <div v-for="(item, index) in this.items" :key="index">
            <div
              class="flex  items-stretch text-white border-b border-black h-auto"
            >
              <div class="w-1/4 self-center  mr-1 bg-bgnew  h-auto">
                {{ item.type }}
              </div>
              <div class="w-1/4 self-center mr-1 bg-bgnew text-center  h-auto">
                {{ item.standing }}
              </div>
              <div class="w-1/4 self-center mr-1 bg-bgnew text-center  h-auto">
                {{ item.levelrange }}
              </div>
              <div
                class="w-1/4 self-center bg-bgnew h-auto"
                v-html="item.rewards"
              ></div>
            </div>
          </div>
        </Accordion>
      </div>
      <NoDataItem v-else :text="headertext" />
    </div>
  </div>
</template>

<script>
import Accordion from '@/components/Accordion.vue';

import TimeBadge from '@/components/TimeBadge.vue';
import NoDataItem from '@/components/NoDataItem.vue';

export default {
  name: 'BountyPanel',
  props: ['syndicate', 'type'],
  computed: {
    headertext() {
      return `${this.type} Bounty Cycle`;
    },
    items: function() {
      return this.syndicate.jobs.map(job => ({
        type: job.type,
        standing: job.standingStages.join(', '),
        levelrange: `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
        rewards: `${job.rewardPool
          .map(reward => `<span>${reward}</span>`)
          .join('<br />')}`
      }));
    }
  },
  data() {
    return {
      fields: [
        {
          key: 'type',
          label: 'Type'
        },
        {
          key: 'standing',
          label: 'Standing',
          thClass: 'text-center'
        },
        {
          key: 'level-range',
          label: 'Level Range'
        },
        {
          key: 'rewards',
          label: 'Rewards'
        }
      ],
      standing: standing
    };
  },
  components: {
    TimeBadge,
    NoDataItem,
    Accordion
  }
};
</script>

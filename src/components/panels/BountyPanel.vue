<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item v-if="syndicate.active" class="list-group-item-borderless">
        <span class="pull-left">Bounties expire in:</span>
        <TimeBadge :starttime="syndicate.activation" :endtime="syndicate.expiry" :interval="1000"/>
      </b-list-group-item>
      <b-list-group-item v-if="syndicate.active" class="list-group-item-borderbottom">
        <Collapsible :headertext="`${headertext} Bounties`">
          <b-table responsive :fields="this.fields" :items="this.items" class="b-table bounty-table">
            <span slot="rewards" slot-scope="data" v-html="data.value"></span>
            <template slot="HEAD_standing" slot-scope="data">
                <HubImg :src="standing" name="Standing" width="32px" height="32px" class="text-center li-mission-decorator li-mission-decorator-lg" />
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
    props: ['syndicate'],
    computed: {
      headertext() {
        return `${this.type} Bounty Cycle`;
      },
      items: function() {
        return this.syndicate.jobs.map((job) => ({
          type: job.type,
          standing: job.standingStages.join(', '),
          'level-range': `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
          rewards: `${job.rewardPool.map((reward) => `<span>${reward}</span>`).join('<br />')}`,
        }));
      }
    },
    data () {
      return {
        fields: [
          {
            key: 'type',
            label: 'Type',
          },
          {
            key: 'standing',
            label: 'Standing',
            thClass: 'text-center',
          },
          {
            key: 'level-range',
            label: 'Level Range',
          },
          {
            key: 'rewards',
            label: 'Rewards',
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
    }
  };
</script>

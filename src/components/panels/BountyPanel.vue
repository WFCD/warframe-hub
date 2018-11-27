<template>
  <b-col md="6" class="panel-header">
    <h3 class="text-center">{{headertext}}</h3>
    <b-list-group>
      <b-list-group-item v-if="syndicate.active" class="list-group-item-borderless">
        <span class="pull-left">Bounties expire in:</span>
        <TimeBadge :starttime="syndicate.activation" :endtime="syndicate.expiry" :interval="1000"/>
      </b-list-group-item>
      <b-list-group-item v-if="syndicate.active" class="list-group-item-borderbottom">
        <b-btn variant="primary" v-b-toggle="`bounty-table-${headertext}`">{{headertext}} Bounties <i class="fas fa-chevron-down"></i></b-btn>
        <b-collapse :id="`bounty-table-${headertext}`">
          <b-card>
            <b-table responsive :fields="this.fields" :items="this.items" class="b-table bounty-table">
              <span slot="rewards" slot-scope="data" v-html="data.value"></span>
              <template slot="HEAD_standing" slot-scope="data">
                  <HubImg :src="standing" name="Standing" class="text-center li-misssion-decorator li-misssion-decorator-lg" />
              </template>
            </b-table>
          </b-card>
        </b-collapse>
      </b-list-group-item>
      <NoDataItem v-else :text="headertext" />
    </b-list-group>
  </b-col>
</template>

<script>
  import TimeBadge from '@/components/TimeBadge.vue';
  import NoDataItem from '@/components/NoDataItem.vue';
  import HubImg from '@/components/HubImg.vue';
  import standing from '@/assets/img/general/standing.svg';

  export default {
    name: 'BountyPanel',
    props: ['syndicate', 'type'],
    computed: {
      headertext() {
        return `${this.type} Bounty Cycle`;
      }
    },
    data () {
      return {
        items: this.syndicate.jobs.map(job => ({
          type: job.type,
          standing: job.standingStages.join(', '),
          'level-range': `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
          rewards: `<ul>${job.rewardPool.map(reward => `<li>${reward}</li>`).join('')}</ul>`,
        })),
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
      TimeBadge,
      NoDataItem,
      HubImg,
    }
  };
</script>

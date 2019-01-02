<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item v-for="(event, index) in events" :key="event.id"
      :class="{ 'list-group-item-borderless': index !== events.length - 1, 'list-group-item-borderbottom': index === events.length - 1 }" v-if="event.active">
        <h5 class="display-5 text-center">{{event.description}}</h5>
        <div class="text-center">{{event.tooltip}}</div><br>
        <div class="text-center bottom-pad">
          <b-badge variant="danger">{{event.victimNode}}</b-badge>
          <b-badge :variant="eventHealthVariant(event)">{{event.health}}% Remaining</b-badge>
        </div>
        <div class="text-center bottom-pad" v-for="reward in event.rewards" :key="makeid()">
          <b-badge v-for="item in reward.items" :key="makeid()" variant="success">{{item}}</b-badge>
          <b-badge v-for="item in reward.countedItems" :key="makeid()" variant="success">{{item}}</b-badge>
          <b-badge v-if="reward.credits" variant="info">{{reward.credits}}cr</b-badge>
        </div>

        <b-row>
          <b-col md="6" v-for="(job, jIndex) in event.jobs" :key="`${job.type.replace(/\s/ig, '-').toLowerCase()}-${index}`" class="bottom-pad">
            <div class="text-center">
              <div class="bottom-pad">{{job.type}} <b-badge variant="info">{{job.enemyLevels[0]}}-{{job.enemyLevels[1]}}</b-badge></div>
              <Collapsible headertext="Standing Stages" class="bottom-pad">>
                <div v-for="s in job.standingStages" :key="`standing-${makeid()}`">{{s}}</div>
              </Collapsible>
              <Collapsible headertext="Rewards">
                <div v-for="r in job.rewardPool" :key="`rewards-${makeid()}`">{{r}}</div>
              </Collapsible>
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
      <NoDataItem v-if="events.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
  import TimeBadge from '@/components/TimeBadge.vue';
  import HubImg from '@/components/HubImg.vue';
  import NoDataItem from '@/components/NoDataItem.vue';
  import HubPanelWrap from '@/components/HubPanelWrap';
  import Collapsible from '@/components/Collapsible';

  export default {
    name: 'EventsPanel',
    props: ['events'],
    computed: {
      headertext() {
        return 'Events';
      },
    },
    methods: {
      eventHealthVariant(event) {
        let healthState = 'success';
        if (event.health > 50 && event.health < 100) {
          healthState = 'warning';
        } else if (event.health < 50) {
          healthState = 'danger';
        }
        return healthState;
      },
      makeid: function() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
      }
    },
    components: {
      TimeBadge,
      HubImg,
      NoDataItem,
      HubPanelWrap,
      Collapsible
    }
  };
</script>

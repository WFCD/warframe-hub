<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item v-for="(event, index) in events" :key="event.id"
      :class="{ 'list-group-item-borderless': index !== events.length - 1, 'list-group-item-borderbottom': index === events.length - 1 }" v-if="event.active">
        <h6 class="display-6 text-center">{{event.description}}</h6>
        <div class="text-center">{{event.tooltip}}</div><br>
        <div class="text-center d-inline">
          <b-badge variant="danger">{{event.victimNode}}</b-badge>
          <b-badge :variant="eventHealthVariant(event)">{{event.health}}% Remaining</b-badge>
        </div><br>
        <div class="text-center" v-if="event.rewards.length">
          <b-badge tag="div" v-for="item in event.rewards" :key="item" variant="success">{{item}}</b-badge>
        </div><br v-if="event.rewards.length">
        <div class="text-center" v-for="(job, jIndex) in event.jobs" :id="`${job.type.replace(/\s/ig, '-').toLowerCase()}-${index}`">
          <div>{{job.type}} <b-badge variant="info">{{job.enemyLevels[0]}}-{{job.enemyLevels[1]}}</b-badge></div>
          <Collapsible headertext="Rewards">
            <div><span v-for="s in job.standingStages" :id="`${s}-${jIndex}`">{{s}}</span><br></div>
          </Collapsible>
          <Collapsible headertext="Standing Stages">
            <span><div v-for="r in job.rewardPool" :id="`${r}-${jIndex}`">{{r}}</div><br></span>
          </Collapsible>
        </div><br v-if="event.rewards.length">
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

<template>
  <HubPanelWrap :title="headertext" :class="{ 'no-content': events.length === 0 }">
    <b-list-group>
      <b-list-group-item
        v-for="(event, index) in events"
        :key="event.id"
        :class="{
          'list-group-item-borderless': index !== events.length - 1,
          'list-group-item-borderbottom': index === events.length - 1,
        }"
        v-if="event.active"
      >
        <h5 class="display-5 text-center">{{ event.description }}</h5>
        <div class="text-center">{{ event.tooltip }}</div>
        <br />
        <div class="text-center bottom-pad">
          <b-badge variant="danger">{{ event.victimNode }}</b-badge>
        </div>
        <b-badge :variant="eventHealthVariant(event)">
          {{ event.health || (100 - (event.currentScore / event.maximumScore) * 100).toFixed(2) }}% Remaining
        </b-badge>
        <div class="text-center bottom-pad" v-for="reward in event.rewards" :key="`rs-${reward.length}-${makeid()}`">
          <b-badge v-for="item in reward.items" :key="`${item}-${makeid()}`" variant="success">
            {{ item }}
          </b-badge>
          <b-badge v-for="item in reward.countedItems" :key="`${item}-${makeid()}`" variant="success">
            {{ item }}
          </b-badge>
          <b-badge v-if="reward.credits" variant="info">{{ reward.credits }}cr</b-badge>
        </div>

        <b-row>
          <b-col
            md="6"
            v-for="job in event.jobs"
            :key="`${job.type.replace(/\s/gi, '-').toLowerCase()}-${index}`"
            class="bottom-pad"
          >
            <div class="text-center">
              <div class="bottom-pad">
                {{ job.type }}
                <b-badge variant="info">{{ job.enemyLevels[0] }}-{{ job.enemyLevels[1] }}</b-badge>
              </div>
              <Collapsible headertext="Standing Stages" class="bottom-pad">
                <div v-for="s in job.standingStages" :key="`standing-${s}-${makeid()}`">
                  {{ s }}
                </div>
              </Collapsible>
              <Collapsible headertext="Rewards">
                <div v-for="r in job.rewardPool" :key="`rewards-${r}-${makeid()}`">
                  {{ r }}
                </div>
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
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import Collapsible from '@/components/Collapsible';

import util from '@/utilities';

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
      const health = event.health;
      let labelClass = 'success';
      if (health <= 80 && health > 50) {
        labelClass = 'info';
      } else if (health <= 50 && health > 20) {
        labelClass = 'warning';
      } else if (health <= 20) {
        labelClass = 'danger';
      }
      return labelClass;
    },
    makeid: function() {
      return util.makeid();
    },
  },
  components: {
    NoDataItem,
    HubPanelWrap,
    Collapsible,
  },
};
</script>

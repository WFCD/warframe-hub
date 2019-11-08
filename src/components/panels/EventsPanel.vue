<template>
  <HubPanelWrap :title="headertext" class="events" :class="{ 'no-content': events.length === 0 }">
    <b-list-group>
      <b-list-group-item
        v-for="(event, index) in activeEvents"
        :key="event.id"
        :class="{
          'list-group-item-borderless': index !== events.length - 1,
          'list-group-item-borderbottom': index === events.length - 1,
        }"
      >
        <h5 class="display-5 text-center">{{ event.description }}</h5>
        <div class="text-center">{{ event.tooltip }}</div>
        <TimeBadge
          v-if="event.activation && event.expiry"
          :starttime="event.activation"
          :endtime="event.expiry"
          :interval="1000"
          :pullright="false"
        />
        <div class="text-center bottom-pad" v-if="event.victimNode !== undefined">
          <b-badge variant="danger">{{ event.victimNode }}</b-badge>
        </div>
        <b-badge v-if="isHealthReversed(event)" class="event-health" :variant="eventHealthVariantOpposite(event)">
          {{ event.health || (100 - (event.currentScore / event.maximumScore) * 100).toFixed(2) }}% Completed
        </b-badge>
        <b-badge v-else class="event-health" :variant="eventHealthVariant(event)">
          {{ event.health || (100 - (event.currentScore / event.maximumScore) * 100).toFixed(2) }}% Remaining
        </b-badge>

        <div v-if="event.rewards" class="text-center">Event Rewards:</div>
        <div class="text-center d-inline" v-for="reward in event.rewards" :key="`rs-${reward.length}-${makeid()}`">
          <b-badge v-for="item in reward.items" :key="`${item}-${makeid()}`" variant="success">
            {{ item }}
          </b-badge>
          <b-badge v-for="item in reward.countedItems" :key="`${item}-${makeid()}`" variant="success">
            {{ item }}
          </b-badge>
          <b-badge v-if="reward.credits" variant="info">{{ reward.credits }}cr</b-badge>
        </div>
        <div class="text-center d-inline" v-for="step in event.interimSteps" :key="`rsi-${step.length}-${makeid()}`">
          <b-badge v-for="item in step.reward.items" :key="`rsi-${item}-${makeid()}`" variant="success">
            {{ item }}
          </b-badge>
          <b-badge v-for="item in step.reward.countedItems" :key="`rsi-${item}-${makeid()}`" variant="success">
            {{ item }}
          </b-badge>
        </div>

        <b-row v-if="event.jobs">
          <b-col
            md="6"
            v-for="job in event.jobs"
            :key="`${job.type.replace(/\s/gi, '-').toLowerCase()}-${index}`"
            class="event-job bottom-pad"
          >
            <div class="text-center">
              <div class="event-job-title bottom-pad">
                <span>{{ job.type }}</span>
                <b-badge variant="info">{{ job.enemyLevels[0] }}-{{ job.enemyLevels[1] }}</b-badge>
              </div>
              <Collapsible headertext="Standing Stages" class="event-job-stages bottom-pad">
                <div v-for="s in job.standingStages" :key="`standing-${s}-${makeid()}`">
                  {{ s }}
                </div>
              </Collapsible>
              <Collapsible headertext="Rewards" class="event-job-rewards">
                <div v-for="r in job.rewardPool" :key="`rewards-${r}-${makeid()}`">
                  {{ r }}
                </div>
              </Collapsible>
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
      <NoDataItem v-if="activeEvents.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import Collapsible from '@/components/Collapsible';
import TimeBadge from '@/components/TimeBadge.vue';

import util from '@/utilities';

const reversedHealthEvents = ['Thermia Fractures'];

export default {
  name: 'EventsPanel',
  props: ['events'],
  computed: {
    headertext() {
      return 'Events';
    },
    activeEvents() {
      return this.$props.events.filter((event) => {
        return event.active;
      });
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
    eventHealthVariantOpposite(event) {
      const health = event.health;
      let labelClass = 'success';
      if (health >= 20 && health < 50) {
        labelClass = 'info';
      } else if (health >= 50 && health < 80) {
        labelClass = 'warning';
      } else if (health >= 80) {
        labelClass = 'danger';
      }
      return labelClass;
    },
    isHealthReversed(event) {
      if (reversedHealthEvents.includes(event.description)) {
        return true;
      }
      return false;
    },
    makeid: function() {
      return util.makeid();
    },
  },
  components: {
    NoDataItem,
    HubPanelWrap,
    Collapsible,
    TimeBadge,
  },
};
</script>

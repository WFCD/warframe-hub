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
          v-if="event && event.activation && event.expiry"
          :starttime="(event && event.activation) || Date.now()"
          :endtime="(event && event.expiry) || Date.now()"
          :interval="1000"
          :pullright="false"
        />
        <div v-if="event.victimNode" class="text-center bottom-pad">
          <b-badge variant="danger">{{ event.victimNode }}</b-badge>
        </div>
        <b-badge v-if="isHealthReversed(event)" class="event-health" :variant="eventHealthVariantOpposite(event)">
          {{
            $t('events.completed', {
              perc: event.health || (100 - (event.currentScore / event.maximumScore) * 100).toFixed(2),
            })
          }}
        </b-badge>
        <b-badge v-else class="event-health" :variant="eventHealthVariant(event)">
          {{
            $t('events.remaining', {
              perc: event.health || (100 - (event.currentScore / event.maximumScore) * 100).toFixed(2),
            })
          }}
        </b-badge>

        <div class="text-center bottom-pad">
          <div v-if="event.rewards">{{ $t('events.rewards.header') }}</div>
          <div v-for="reward in event.rewards" :key="`rs-${reward.length}-${makeid()}`" class="text-center d-inline">
            <b-badge v-for="item in reward.items" :key="`${item}-${makeid()}`" variant="success">
              {{ item }}
            </b-badge>
            <b-badge v-for="item in reward.countedItems" :key="`${item}-${makeid()}`" variant="success">
              {{ item }}
            </b-badge>
            <b-badge v-if="reward.credits" variant="info"> {{ reward.credits }}{{ $t('currency.credAbbr') }} </b-badge>
          </div>
          <div v-for="step in event.interimSteps" :key="`rsi-${step.length}-${makeid()}`" class="text-center d-inline">
            <b-badge v-for="item in step.reward.items" :key="`rsi-${item}-${makeid()}`" variant="success">
              {{ item }}
            </b-badge>
            <b-badge v-for="item in step.reward.countedItems" :key="`rsi-${item}-${makeid()}`" variant="success">
              {{ item }}
            </b-badge>
          </div>
        </div>

        <b-row v-if="event.jobs">
          <b-table
            ref="event-table"
            selectable
            :fields="fields"
            :items="formatJobItems(event)"
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
            <template #cell(moreinfo)="row">
              <div size="sm" class="mr-2" @click="row.toggleDetails">
                <i v-if="row.detailsShowing" class="fas fa-chevron-down"></i>
                <i v-else class="fas fa-chevron-right"></i>
              </div>
            </template>
            <template #row-details="row">
              <span>
                <b-badge v-for="(reward, index) in row.item.rewards" :key="`reward-${index}`">{{ reward }}</b-badge>
              </span>
            </template>
          </b-table>
        </b-row>

        <div class="text-center bottom-pad">
          <div v-if="event.completionBonuses.length" class="text-center">{{ $t('events.completionBonuses') }}</div>
          <b-badge v-for="bonus in event.completionBonuses" :key="`rsi-${bonus}`" variant="secondary">
            {{ bonus }}
          </b-badge>
        </div>

        <div v-if="event.altActivation !== epoch && event.altExpiry !== epoch" class="text-center bottom-pad">
          <div>{{ $t('events.currentCycle') }}</div>
          <TimeBadge :starttime="event.altActivation" :endtime="event.altExpiry" :interval="1000" :pullright="false" />
        </div>

        <div v-if="event.nextAlt.activation !== epoch && event.nextAlt.expiry !== epoch" class="text-center bottom-pad">
          <div>{{ $t('events.nextCycle') }}</div>
          <TimeBadge
            :starttime="(event && event.nextAlt && event.nextAlt.activation) || Date.now()"
            :endtime="(event && event.nextAlt && event.nextAlt.expiry) || Date.now()"
            :interval="1000"
            :pullright="false"
          />
        </div>
      </b-list-group-item>
      <NoDataItem v-if="activeEvents.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import TimeBadge from '@/components/TimeBadge.vue';
import HubImg from '@/components/HubImg.vue';

import { makeid, cdn } from '@/services/utilities';

const standing = cdn('svg/standing.svg');

const epoch = '1970-01-01T00:00:00.000Z';
const reversedHealthEvents = ['Thermia Fractures'];

export default {
  name: 'EventsPanel',
  components: {
    NoDataItem,
    HubPanelWrap,
    TimeBadge,
    HubImg,
  },
  props: {
    events: {
      type: Array,
      default: () => [],
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
      epoch,
    };
  },
  computed: {
    headertext() {
      return this.$t('events.header');
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
      return reversedHealthEvents.includes(event.description);
    },
    formatJobItems(event) {
      return event.jobs.map((job) => ({
        type: job.type,
        standing: job.standingStages.reduce((a, b) => a + b) || 0,
        'level-range': `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
        rewards: job.rewardPool || [],
        _showDetails: this.check,
      }));
    },
    makeid,
    toggleDetails(row) {
      row._showDetails = !row._showDetails;
    },
  },
};
</script>

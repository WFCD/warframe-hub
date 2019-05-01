<template>
  <div class=" max-w-xl    rounded overflow-hidden  border-transparent">
    <div class="font-bold text-default text-4xl mt-1 bg-transparent ">
      {{ headertext }}
    </div>
    <div class=" text-default w-full bg-bgnew shadow-lg pb-2 ">
      <div>
        <div
          class="flex mx-1 py-1  "
          v-for="(challenge, index) in nightwave.activeChallenges"
          :key="challenge.id"
        >
          <div class="w-1/8 bg-bgnew h-12 ">
            <HubImg
              :src="
                challenge.isDaily ? daily : challenge.isElite ? elite : weekly
              "
              :name="
                challenge.isDaily
                  ? 'Daily'
                  : challenge.isElite
                  ? 'Elite Weekly'
                  : 'Weekly'
              "
              class="li-mission-decorator li-mission-decorator-lg invert"
              :height="challenge.isDaily ? '20px' : '32px'"
              width="32px"
            />
          </div>
          <div class="w-5/12 bg-bgnew h-6">
            <span class="pull-left">
              {{ challenge.title }}
            </span>
          </div>
          <div class="w-2/4 bg-bgnew h-6">
            <TimeBadge
              class="pull-right"
              :starttime="challenge.activation"
              :endtime="challenge.expiry"
              :interval="1000"
            />
          </div>
          <div class="w-1/3 bg-bgnew h-6 pr-1">
            <div :class="formatbadage(challenge.isDaily, challenge.isElite)">
              <HubImg
                :src="standing"
                name="Standing Gain"
                class="inline"
                width="12px"
              />
              {{ challenge.reputation }}
            </div>
          </div>
        </div>
        <NoDataItem
          v-if="nightwave.activeChallenges.length === 0"
          :text="headertext"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';
import HubImg from '@/components/HubImg';

import daily from '@/assets/img/nightwave/daily.png';
import weekly from '@/assets/img/nightwave/weekly.png';
import elite from '@/assets/img/nightwave/elite.png';
import standing from '@/assets/img/general/standing.svg';

export default {
  name: 'Nightwave',
  props: ['nightwave'],
  computed: {
    headertext() {
      return 'Nightwave';
    }
  },
  methods: {
    formatbadage(daily, elite) {
      var x = 'bg-yellow-500';
      if (daily) {
        x = 'bg-green-500';
      } else if (elite) {
        x = 'bg-red-500';
      }
      return x + ' text-white font-bold py-0 px-4 rounded-full';
    }
  },
  data() {
    return {
      styleObject: {
        display: 'inline'
      },
      daily: daily,
      weekly: weekly,
      elite: elite,
      standing: standing
    };
  },
  components: {
    TimeBadge,
    NoDataItem,
    HubPanelWrap,
    HubImg
  }
};
</script>

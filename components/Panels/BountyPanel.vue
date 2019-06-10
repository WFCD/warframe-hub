<template>
  <div
    class="max-w-lg md:max-w-md sm:max-w-sm xl:max-w-xl h-auto overflow-hidden border-transparent"
  >
    <div class="text-primary text-center text-4xl mt-1">
      {{ syndicate }} Bounty Cycle
    </div>
    <div class="bg-box text-primary pt-0 border-box border-b-2 rounded ">
      <div v-if="!syndicatedata" class="text-primary ">
        <div
          class="bg-transparent border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong class="font-bold">No Jobs today</strong>
        </div>
      </div>
      <div v-if="syndicatedata" class="flex items-center py-2">
        <div class="w-1/3 h-auto pl-2">Ends</div>
        <div class="w-full text-right h-auto  mr-3">
          {{ timezonetime(syndicatedata.expiry) }}
        </div>
        <!---->
      </div>

      <badger-accordion v-if="syndicatedata" :icons="false">
        <badger-accordion-item v-for="job in syndicatedata.jobs" :key="job.id">
          <div slot="header" class="px-2 flex items-center">
            <p class="w-full">{{ job.type.split('/').slice(-1)[0] }}</p>
            <span class="flex-shrink-0 p-2"
              >Lvl: {{ job.enemyLevels[0] }}-{{ job.enemyLevels[1] }}</span
            >
          </div>
          <div slot="content" class="break-all">
            <div class="flex  items-center">
              <div class="w-full bg-box h-auto pl-2">
                Rewards
              </div>
              <div class="w-1/3 bg-box h-auto  pr-2">
                Standing
              </div>
            </div>
            <div
              class="flex bg-box text-primary items-center px-2 border-t border-gray-600"
            >
              <div class="w-full break-all h-auto">
                <span
                  v-for="(reward, index) in job.rewardPool"
                  :key="index"
                  :index="index"
                >
                  {{ reward }}<br
                /></span>
              </div>
              <div class="w-1/2 self-stretch content-center text-center ">
                <span
                  v-for="(stand, index) in job.standingStages"
                  :key="index"
                  :index="index"
                >
                  {{ stand }}<br
                /></span>
              </div>
            </div>
          </div>
        </badger-accordion-item> </badger-accordion
      ><!---->
    </div>
  </div>
</template>

<style lang="postcss">
.js-badger-accordion-header {
  @apply bg-box;
  @apply border-gray-600;
  @apply border-t;
  display: block !important;
  &:hover,
  &.-ba-is-active {
    @apply bg-blue-600;
  }
}
.dd {
  margin-inline-start: 0em !important;
  margin-inline-end: 0em !important;
}
.dl {
  margin-block-start: 0em !important;
}
.js-badger-accordion-panel-inner {
  cursor: text;
  @apply bg-gray-400;
}
.badger-accordion-toggle {
  padding: 0%;
}
.badger-accordion__panel {
  max-height: 75vh !important;
  transition: max-height ease-in-out 0.5s;
  overflow: hidden;
  &.-ba-is-hidden {
    max-height: 0 !important;
  }
  .badger-accordion--initalised & {
    transition: max-height ease-in-out 0.2s;
  }
}
</style>

<script>
import moment from 'moment'

export default {
  name: 'SyndicatePanel',
  // eslint-disable-next-line
  props: ['syndicatedata', 'syndicate'],
  data() {
    return {
      platinum: 'platinum',
      test: false
    }
  },
  methods: {
    headertext(var1) {
      let x = var1
      x = x.replace('Syndicate', ' ')
      return x
    },
    timezonetime(prop1) {
      const x = moment(prop1).format('llll')
      return x
    }
  }
}
</script>

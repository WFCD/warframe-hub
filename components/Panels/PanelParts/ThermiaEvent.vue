<template>
  <div class="h-auto overflow-hidden border-transparent">
    <div class="flex items-center py-2">
      <div class="w-1/3 h-auto pl-2">Ends</div>
      <div class="w-full text-right h-auto  mr-3">
        {{ timezonetime(eventdata.expiry) }}
      </div>
      <!---->
    </div>
    <div class=" flex items-center py-2">
      <div class="w-1/3 h-auto pl-2">Completed</div>

      <div class="h-4 shadow w-full bg-white rounded bg-red-700 mr-2">
        <div
          :style="'width:' + eventdata.currentScore + '%'"
          class="bg-green-700 h-4 w-1/2 rounded text-xs leading-none py-1 text-center text-white"
        >
          {{ eventdata.currentScore }}%
        </div>
      </div>
    </div>
    <div class="flex justify-between pb-2">
      <div class="self-center  h-auto pl-2">Personal Event</div>
      <div class=" h-auto  mr-3">
        <div
          :class="
            (eventdata.isPersonal ? 'bg-green-700' : 'bg-red-700') +
              ' font-bold py-1 px-4 rounded-full'
          "
        >
          {{ eventdata.isPersonal ? 'Yes' : 'No' }}
        </div>
      </div>
      <!---->
    </div>
    <div
      v-for="(reward, i) in eventdata.rewards"
      :index="i"
      :key="reward.asString"
    >
      <div v-if="reward.itemString" class="px-2 flex items-center">
        <p class="w-full">Event Reward Nr.{{ i + 1 }}</p>
        <span class="flex-shrink-0 p-2">
          {{ reward.itemString }}
        </span>
      </div>
    </div>
    <badger-accordion :icons="false">
      <badger-accordion-item
        v-for="(step, i) in eventdata.interimSteps"
        :key="step.asString"
        :index="i"
      >
        <div slot="header" class="px-2 flex items-center">
          <p class="w-full">Reward at a Score of</p>
          <span class="flex-shrink-0 p-2"> {{ step.goal }} </span>
        </div>
        <div slot="content" class="break-all">
          <div class="flex  items-center">
            <div class="w-full bg-box h-auto pl-2">
              Items
            </div>
            <div class="w-1/3 bg-box h-auto  pr-2">
              Credits
            </div>
          </div>
          <div
            class="flex bg-box text-primary items-center px-2 border-t border-gray-600"
          >
            <div class="w-full break-all h-auto">
              <span
                v-for="(item, index) in step.reward.items"
                :key="index"
                :index="index"
              >
                {{ item }}<br
              /></span>
            </div>
            <div class="w-1/2 self-stretch content-center text-center ">
              <span> {{ step.reward.credits }}<br /></span>
            </div>
          </div>
        </div>
      </badger-accordion-item>
    </badger-accordion>
  </div>
</template>

<style lang="postcss">
.popper {
  @apply bg-black !important;
  @apply text-white;
  @apply border-0;
  @apply text-xs;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  width: auto;
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  position: absolute;
  font-weight: normal;
  z-index: 200000;
  box-shadow: rgb(58, 58, 58) 0 0 6px 0;
}
.popper .popper__arrow {
  color: black !important;
}
.popper[x-placement^='top'] .popper__arrow {
  border-color: black transparent transparent transparent !important;
}
</style>

<script>
import moment from 'moment'

export default {
  name: 'TherminaEventPanel',
  // eslint-disable-next-line
  props: ['eventdata'],
  data() {
    return {
      platinum: 'platinum',
      test: false
    }
  },
  computed: {
    filteredinvasions: function() {
      const item = this.$props.invasions.filter(function(item) {
        return !item.completed
      })
      return item
    }
  },
  methods: {
    placeholder(prop) {
      const x = prop.substring(1)
      // eslint-disable-next-line
      console.log(x)
      return x
    },
    timezonetime(prop1) {
      const x = moment(prop1).format('llll')
      return x
    },
    getcolourfaction(prop) {
      let x = null
      if (prop === 'Grineer') {
        x = 'bg-red-600'
      } else if (prop === 'Corpus') {
        x = 'bg-blue-600'
      } else if (prop === 'Infested') {
        x = 'bg-green-600'
      } else {
        x = 'bg-white'
      }
      return x
    }
  }
}
</script>

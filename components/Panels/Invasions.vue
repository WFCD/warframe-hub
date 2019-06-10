<template>
  <div
    class="max-w-xl md:max-w-md sm:max-w-sm xl:max-w-xl h-auto overflow-hidden border-transparent"
  >
    <div class="text-primary text-center text-4xl mt-1">
      Invasions
    </div>
    <div class="bg-box text-primary pt-0 border-box border-b-2 rounded ">
      <div v-if="!invasions" class="text-primary ">
        <div
          class="bg-transparent border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong class="font-bold">No Jobs today</strong>
        </div>
      </div>
      <div v-if="invasions">
        <div
          v-for="(invasion, index) in filteredinvasions"
          :key="index"
          :index="index"
          class="flex flex-wrap  w-full  py-2"
        >
          <div class="text-center w-4/5 h-auto">
            <span class=" font-bold "> {{ invasion.node }}</span
            ><br />{{ invasion.desc }} (Ends in {{ invasion.eta }})
          </div>
          <div class=" text-center w-1/5 h-auto">
            <popper
              trigger="hover"
              :options="{
                placement: 'top'
              }"
            >
              <div class="popper">
                Ongoing for {{ placeholder(invasion.startString) }}
              </div>
              <button
                slot="reference"
                class="bg-tooltipbtn py-2 px-4 rounded-lg self-center text-center"
              >
                ?
              </button>
            </popper>
          </div>
          <br />
          <div class=" mt-1  px-6 flex  w-full h-4 justify-between">
            <div
              :class="
                getcolourfaction(invasion.attackingFaction) +
                  ' self-center font-medium text-left text-white text-xs px-2 rounded'
              "
            >
              {{ invasion.attackerReward.asString }}
            </div>
            <div
              :class="
                getcolourfaction(invasion.defendingFaction) +
                  ' self-center text-left text-white font-medium text-xs px-2 rounded'
              "
            >
              {{ invasion.defenderReward.asString }}
            </div>
          </div>
          <div class=" w-full mx-2">
            <div
              :class="
                getcolourfaction(invasion.defendingFaction) +
                  ' h-4 shadow w-full bg-white rounded'
              "
            >
              <div
                :style="'width:' + invasion.completion + '%'"
                :class="
                  getcolourfaction(invasion.attackingFaction) +
                    ' h-4 w-1/2 rounded text-xs leading-none py-1 text-center text-white'
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.popper {
  @apply bg-black;
  @apply text-white;
  @apply border-0;
  @apply text-xs;
  @apply px-3;
  width: auto;
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  position: absolute;
  font-weight: normal;
  z-index: 200000;
  box-shadow: rgb(58, 58, 58) 0 0 6px 0;
}
</style>

<script>
import moment from 'moment'

export default {
  name: 'InvasionPanel',
  // eslint-disable-next-line
  props: ['invasions', 'syndicate'],
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

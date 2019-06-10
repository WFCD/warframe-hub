<template>
  <div
    class="max-w-lg md:max-w-md sm:max-w-sm xl:max-w-xl h-auto rounded overflow-hidden border-transparent"
  >
    <div class="text-center text-primary text-4xl mt-1 bg-transparent">
      {{ type }} Cycle
    </div>
    <div class="bg-box text-primary pt-0 ">
      <div v-if="!timer" class="text-primary ">
        <div
          class="bg-transparent border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong class="font-bold">No Time info</strong>
        </div>
      </div>
      <div v-else>
        <div
          v-if="type == 'Earth' || type == 'Cetus'"
          class="flex items-center  w-full  py-2"
        >
          <div class="ml-4 text-left w-1/2 h-auto">Currently it is:</div>
          <div class="w-full text-right h-auto mr-4">
            <fa
              v-if="timer.isDay"
              icon="sun"
              fixed-width
              :style="{
                color: 'yellow'
              }"
            /><fa
              v-else
              icon="moon"
              fixed-width
              :style="{
                color: 'white'
              }"
            />
            {{ capitalizeFirstLetter(timer.state) }}
          </div>
        </div>
        <div v-else class="flex items-center  w-full  py-2">
          <div class="ml-4 text-left w-1/2 h-auto">Currently it is:</div>
          <div class="w-1/2 text-right h-auto mr-4">
            <fa
              v-if="!timer.isWarm"
              icon="snowflake"
              fixed-width
              :style="{
                color: 'cyan'
              }"
            /><fa
              v-else
              icon="sun"
              fixed-width
              :style="{
                color: 'yellow'
              }"
            />
            {{ capitalizeFirstLetter(timer.state) }}
          </div>
        </div>
        <div
          v-if="type == 'Earth' || type == 'Cetus'"
          class="flex items-center  w-full  py-2"
        >
          <div class="ml-4 text-left w-1/2 h-auto">
            Time until
            <fa v-if="timer.isDay" icon="moon" fixed-width /><fa
              v-else
              icon="sun"
              fixed-width
              :style="{
                color: 'yellow'
              }"
            />
          </div>
          <div class="w-1/2 text-right h-auto mr-4">
            {{ timer.timeLeft }}
          </div>
        </div>
        <div v-else class="flex items-center  w-full  py-2">
          <div class="ml-4 text-left w-1/2 h-auto">
            Time until
            <fa
              v-if="!timer.isWarm"
              icon="snowflake"
              fixed-width
              :style="{
                color: 'cyan'
              }"
            /><fa
              v-else
              icon="sun"
              fixed-width
              :style="{
                color: 'yellow'
              }"
            />
          </div>
          <div class="w-1/2 text-right h-auto mr-4">
            {{ timer.timeLeft }}
          </div>
        </div>
        <div class="flex items-center  w-full  py-2 border-b border-gray-600">
          <div
            v-if="type == 'Earth' || type == 'Cetus'"
            class="ml-4 text-left w-time h-auto"
          >
            Time at
            <fa v-if="timer.isDay" icon="moon" fixed-width /><fa
              v-else
              icon="sun"
              fixed-width
              :style="{
                color: 'yellow'
              }"
            />
          </div>
          <div v-else class="ml-4 text-left w-time h-auto">
            Time at
            <fa
              v-if="!timer.isWarm"
              icon="snowflake"
              fixed-width
              :style="{
                color: 'cyan'
              }"
            /><fa
              v-else
              icon="sun"
              fixed-width
              :style="{
                color: 'yellow'
              }"
            />
          </div>
          <div class="w-full text-right h-auto  mr-4">
            {{ timezonetime(timer.expiry) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table.table div,
table.table th,
table.table > thead > tr {
  border: 0;
}
circles-text[style] {
  line-height: 90px !important;
}
</style>

<script>
import moment from 'moment'

export default {
  name: 'TimePanel',
  // eslint-disable-next-line
  props: ['timer', 'type'],
  methods: {
    timezonetime(prop1) {
      const x = moment(prop1).format('llll')
      return x
    },
    capitalizeFirstLetter(s) {
      return s && s[0].toUpperCase() + s.slice(1)
    }
  }
}
</script>

<template>
  <div class="xl:flex-1 xl:flex xl:overflow-y-hidden">
    <div class="py-6 xl:flex-1 xl:overflow-x-hidden">
      <div
        v-for="(rivencat, name, i) in data"
        :key="i"
        :class="{ 'mt-6': i > 0 }"
      >
        <div class="px-4 xl:px-8">
          <h3 class="text-gray-900 text-xl">{{ name }}</h3>
          <p class="text-gray-600">{{ name }}</p>
        </div>
        <div class="mt-6 sm:overflow-x-auto sm:overflow-y-hidden">
          <div class="px-4 sm:inline-flex sm:pt-2 sm:pb-8 xl:px-8">
            <div
              v-for="(riven, index2, i) in rivencat"
              :key="i"
              :class="{ 'mt-10 sm:ml-4': i > 0 }"
              class=" max-w-sm sm:mt-0 sm:w-80 sm:flex-shrink-0"
            >
              <TestCard :property="riven" :test="index2" />
            </div>
          </div>
        </div>
      </div>
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
import { mapState, mapGetters } from 'vuex'
import platforms from '@/assets/json/platforms.json'
import TestCard from '~/components/Panels/PanelParts/TestCard.vue'

import fetch from 'node-fetch'
import _ from 'lodash'

const repoBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://n9e5v4d8.ssl.hwcdn.net'
    : 'http://n9e5v4d8.ssl.hwcdn.net'

export default {
  name: 'Rivendata',
  components: {
    TestCard
  },
  data() {
    return {
      url: '',
      activetab: '',
      platforms: platforms,
      data: {
        'Riven Mod': {
          null: [
            {
              rerolled: false,
              avg: 0,
              stddev: 0,
              min: 0,
              max: 0,
              pop: 0,
              median: 0
            }
          ]
        }
      },
      loading: true
    }
  },
  computed: {
    ...mapState({
      platform: 'platform'
    }),
    ...mapGetters({
      platform: 'platform'
    })
  },
  watch: {
    platform: val => {
      this.loading = true
      this.url = `${repoBaseUrl}/repos/weeklyRivens${val.toUpperCase()}.json`
      this.getdata()
    }
  },
  mounted() {
    this.url = `${repoBaseUrl}/repos/weeklyRivens${this.platform.toUpperCase()}.json`
    this.getdata()
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
    checktitle(title) {
      return title === 'null'
        ? 'No compatibility returned'
        : this.capitalizeFirstLetter(title)
    },
    track() {
      this.$ga.page('/riven/data')
    },
    async getdata() {
      const res = JSON.parse(
        (await fetch(this.url).then(res => res.text())).replace(/NaN/g, 0)
      )

      const rivenData = _.mapValues(_.groupBy(res, 'itemType'), clist =>
        clist.map(car => _.omit(car, 'itemType'))
      )

      Object.keys(rivenData).forEach(key => {
        rivenData[key] = _.mapValues(
          _.groupBy(rivenData[key], 'compatibility'),
          clist2 => clist2.map(car1 => _.omit(car1, 'compatibility'))
        )
      })
      this.data = rivenData
      this.activetab = Object.keys(this.data)[0]
      this.loading = false
    }
  }
}
</script>
<style scoped>
.row {
  margin-right: 0px !important;
  margin-left: 0px !important;
}
</style>

<template>
  <div class="h-auto  timers  ">
    <div class=" text-center bg-purple-500 text-white sm:bg-green-500 md:bg-blue-500 md:text-yellow-500 lg:bg-red-500 xl:bg-orange-500 ...">
      ...
    </div>
<div class="bg-red-500 text-white font-bold rounded-t px-2 mx-2 mt-1 py-2">
    Danger
  </div>
  <div class="border border-t-0 border-red-400 rounded-b bg-red-100 mx-2 px-2 py-3 text-red-700">
    <p>Something not ideal might be happening.</p>
  </div>
    <div class=" pt-2   flex flex-wrap text-black text-left">
      <div class="h-auto  flex w-full   lg:w-1/2  md:pb-1 px-2">
        <div
          class="card-image lg:w-1/2"
          style="background-image: url('https://vignette.wikia.nocookie.net/warframe/images/b/b3/RivenVeiledMod.png')"
        ></div>
        <div class="xs:w-screen  lg:w-full  md:w-screen xl:w-full  md:w-screen  lg:p-3 card-riven-desc">
          <div class="mb-4 ">
            <p class="text-sm text-grey-dark flex items-start">
              <svg
                class=" stroke-current text-purple-500 w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke-width="2"
                  d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"
                />
                <line
                  stroke-width="2"
                  y2="0.0"
                  x2="24.0"
                  y1="24.0"
                  x1="0.0"
                />
              </svg>
              Not Rerolled
            </p>
            <div class="text-black font-bold text-xl mb-1">
              Kitgun Riven Mod
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Avg. value of trades</div>
              <div class="w-1/4   text-right   h-6">xx.xx</div>
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Avg. price variation</div>
              <div class="w-1/4   text-right   h-6">xx.xx</div>
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Min price for this riven</div>
              <div class="w-1/4   text-right h-6">xx.xx</div>
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Max. price for this riven</div>
              <div class="w-1/4   text-right   h-6">xx.xx</div>
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Popularity of this Type</div>
              <div class="w-1/4   text-right   h-6">xx.xx</div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-auto  flex w-full   lg:w-1/2  md:pb-1 px-2">
        <div
          class="card-image lg:w-1/2"
          style="background-image: url('https://vignette.wikia.nocookie.net/warframe/images/b/b3/RivenVeiledMod.png')"
        ></div>
        <div class="xs:w-screen  lg:w-full  md:w-screen xl:w-full  md:w-screen  lg:p-3 card-riven-desc">
          <div class="mb-4 ">
            <p class="text-sm text-grey-dark flex items-center">
              <svg
                class=" stroke-current text-purple-500 w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke-width="2"
                  d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"
                />
              </svg>
              Rerolled
            </p>
            <div class="text-black font-bold text-xl mb-1">
              Kitgun Riven Mod
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Avg. value of trades</div>
              <div class="w-1/4 text-right   h-6">xx.xx</div>
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Avg. price variation</div>
              <div class="w-1/4  text-right   h-6">xx.xx</div>
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Min price for this riven</div>
              <div class="w-1/4 text-right h-6">xx.xx</div>
            </div>
            <div class="flex mb-1 text-black text-left">
              <div class="w-3/4   h-6 mr-1">Max. price for this riven</div>
              <div class="w-1/4  text-right   h-6">xx.xx</div>
            </div>
            <div class="flex  mb-1 text-black text-left">
              <div class="w-3/4  flex-1 h-6 mr-1">
                Popularity of this Type
              </div>
              <div class="w-1/4   text-right   h-6">xx.xx</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import platforms from '@/assets/json/platforms.json';

import fetch from 'node-fetch';
import _ from 'lodash';

const repoBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://n9e5v4d8.ssl.hwcdn.net'
    : 'http://n9e5v4d8.ssl.hwcdn.net';

export default {
  name: 'rivendata',
  data() {
    return {
      url: '',
      open: false,
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
    };
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
      this.loading = true;
      this.url = `${repoBaseUrl}/repos/weeklyRivens${val.toUpperCase()}.json`;
      this.getdata();
    }
  },
  mounted() {
    this.url = `${repoBaseUrl}/repos/weeklyRivens${this.platform.toUpperCase()}.json`;
    this.getdata();
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    checktitle(title) {
      return title === 'null'
        ? 'No compatibility returned'
        : this.capitalizeFirstLetter(title);
    },
    track() {
      this.$ga.page('/riven/data');
    },
    async getdata() {
      const res = JSON.parse(
        (await fetch(this.url).then(res => res.text())).replace(/NaN/g, 0)
      );

      const rivenData = _.mapValues(_.groupBy(res, 'itemType'), clist =>
        clist.map(car => _.omit(car, 'itemType'))
      );

      Object.keys(rivenData).forEach(key => {
        rivenData[key] = _.mapValues(
          _.groupBy(rivenData[key], 'compatibility'),
          clist2 => clist2.map(car1 => _.omit(car1, 'compatibility'))
        );
      });
      this.data = rivenData;
      this.loading = false;
    }
  }
};
</script>
<style scoped>
.row {
  margin-right: 0px !important;
  margin-left: 0px !important;
}
</style>

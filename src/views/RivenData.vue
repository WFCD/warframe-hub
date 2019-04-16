<template>
  <div class="h-auto  timers  ">
    <div
      class=" text-center bg-purple-500 text-white sm:bg-green-500 md:bg-blue-500 md:text-yellow-500 lg:bg-red-500 xl:bg-orange-500 ..."
    >
      ...
    </div>
    <div class="bg-red-500 text-white font-bold rounded-t px-2 mx-2 mt-1 py-2">
      Danger
    </div>
    <div
      class="border border-t-0 border-red-400 rounded-b bg-red-100 mx-2 px-2 py-3 text-red-700"
    >
      <p>Something not ideal might be happening.</p>
    </div>
    <div class="bg-blue-500 w-100 rounded">
      <ul class="reset flex h-12 font-medium text-white">
        <li
          v-for="(tab, index) in data"
          :key="index"
          :class="{
            'bg-white text-blue-500': index == tabactive,
            'mx-1 px-1 pt-3 pb-2 cursor-pointer': true
          }"
          @click="toggleTo(index)"
        >
          {{ index.split(' ')[0] }}
        </li>
      </ul>
      <div
        class="flex-wrap  pt-2  bg-white"
        v-for="(item2, index2) in data[tabactive]"
        :key="index2"
      >
        <div
          class=" bg-white w-full"
          v-for="(items, iindex) in item2"
          :key="iindex"
        >
          <div class="h-auto   flex  md:pb-1 px-2 h-12">
            <div
              :class="{
                'card-image w-1/2': true,
                'border-t-0 rounded-t-none': iindex == 1,
                'border-b-0 rounded-b-none': checktab(iindex, item2)
              }"
              style="background-image: url('https://vignette.wikia.nocookie.net/warframe/images/b/b3/RivenVeiledMod.png')"
            ></div>
            <div
              :class="{
                'xs:w-screen  lg:w-full  md:w-screen xl:w-full  md:w-screen lg:p-3 card-riven-desc': true,
                'border-t-0 rounded-t-none': checktab(iindex, item2) == 0,
                'border-b-0 rounded-b-none': checktab(iindex, item2)
              }"
            >
              <div class="mt-4 mb-4 ">
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
                      v-if="!items.rerolled"
                      stroke-width="2"
                      y2="0.0"
                      x2="24.0"
                      y1="24.0"
                      x1="0.0"
                    />
                  </svg>
                  <span v-if="!items.rerolled">Not&nbsp;</span> Rerolled
                </p>
                <div class="text-black font-bold text-xl mb-1">
                  {{ index2 }}
                </div>
                <div class="flex mb-1 text-black text-left">
                  <div class="w-3/4   h-6 mr-1">Avg. trade value</div>
                  <div class="w-1/4   text-right   h-6">
                    {{ items.avg.toFixed(2) }}
                  </div>
                </div>
                <div class="flex mb-1 text-black text-left">
                  <div class="w-3/4   h-6 mr-1">Avg. price variation</div>
                  <div class="w-1/4   text-right   h-6">
                    {{ items.stddev.toFixed(2) }}
                  </div>
                </div>
                <div class="flex mb-1 text-black text-left">
                  <div class="w-3/4   h-6 mr-1">Min price</div>
                  <div class="w-1/4   text-right h-6">
                    {{ items.min.toFixed(2) }}
                  </div>
                </div>
                <div class="flex mb-1 text-black text-left">
                  <div class="w-3/4   h-6 mr-1">Max. price</div>
                  <div class="w-1/4   text-right   h-6">
                    {{ items.max.toFixed(2) }}
                  </div>
                </div>
                <div class="flex mb-1 text-black text-left">
                  <div class="w-3/4   h-6 mr-1">Type Popularity</div>
                  <div class="w-1/4   text-right   h-6">
                    {{ items.pop.toFixed(3) }}&nbsp;%
                  </div>
                </div>
              </div>
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
      tabactive: 'Kitgun Riven Mod',
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
    toggleTo(index) {
      console.log(index);
      this.tabactive = index;
    },
    checktab(i1, i2) {
      console.log(i2.length);
      if (i1 == 0 && i2.length == 2) {
        return 1;
      } else if (i1 == 1 && i2.length == 2) {
        return 0;
      } else {
        return 2;
      }
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

<template>
  <b-container fluid class="pl-0 pr-0 ">
    <b-alert v-if="loading" show variant="info">
      <h4 class="alert-heading">Loading Riven Data for {{ platforms[platform].display }}</h4>
      <hr />
      <p class="mb-0">
        If this card stays active for more than a minute, please reload the site or try agin later.
      </p>
    </b-alert>
    <b-tabs v-else content-class="mt-3">
      <b-tab :title="index" v-for="(item, index) in data" :key="index" active>
        <b-card-group>
          <b-col class="pl-0 pr-0 ml-0 mr-0" sm="10">
            <b-card class="vw-100" :title="index">
              <b-card no-body class="mb-1" v-for="(item2, index2) in item" :key="index2">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block href="#" v-b-toggle="`accordion${index}${index2}`" variant="info">
                    {{ checktitle(index2) }}
                  </b-button>
                </b-card-header>
                <b-collapse :id="'accordion' + index + index2" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-group class="pl-0 pr-0">
                      <b-card
                        :title="items.rerolled ? 'Rerolled' : 'Unrolled'"
                        v-for="(items, iindex) in item2"
                        :key="iindex"
                      >
                        <b-card-body>
                          <b-list-group>
                            <b-list-group-item class="d-flex justify-content-between align-items-center">
                              Average value of trades
                              <b-badge variant="primary" pill>{{ items.avg.toFixed(2) }}</b-badge>
                            </b-list-group-item>

                            <b-list-group-item class="d-flex justify-content-between align-items-center">
                              The average price variation
                              <b-badge variant="primary" pill>{{ items.stddev.toFixed(2) }}</b-badge>
                            </b-list-group-item>

                            <b-list-group-item class="d-flex justify-content-between align-items-center">
                              Lowest price for this riven
                              <b-badge variant="primary" pill>{{ items.min.toFixed(2) }}</b-badge>
                            </b-list-group-item>
                            <b-list-group-item class="d-flex justify-content-between align-items-center">
                              Highest price for this riven
                              <b-badge variant="primary" pill>{{ items.max.toFixed(2) }}</b-badge>
                            </b-list-group-item>
                            <b-list-group-item class="d-flex justify-content-between align-items-center">
                              Popularity of this Riven Type
                              <b-badge variant="primary" pill>{{ items.pop.toFixed(4) }} %</b-badge>
                            </b-list-group-item>
                          </b-list-group>
                        </b-card-body>
                      </b-card>
                    </b-card-group>
                    <b-card-text>
                      Raw Data <span>{{ item2 }}</span> <br />Platform:
                      {{ platforms[platform].display }}
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </b-card>
          </b-col>
        </b-card-group>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import platforms from '@/assets/json/platforms.json';

import fetch from 'node-fetch';
import _ from 'lodash';

const repoBaseUrl =
  process.env.NODE_ENV === 'production' ? 'https://n9e5v4d8.ssl.hwcdn.net' : 'http://n9e5v4d8.ssl.hwcdn.net';

export default {
  name: 'rivendata',
  data() {
    return {
      url: '',
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
              median: 0,
            },
          ],
        },
      },
      loading: true,
    };
  },
  computed: {
    ...mapState({
      platform: 'platform',
    }),
    ...mapGetters({
      platform: 'platform',
    }),
  },
  watch: {
    platform: (val) => {
      this.loading = true;
      this.url = `${repoBaseUrl}/repos/weeklyRivens${val.toUpperCase()}.json`;
      this.getdata();
    },
  },
  mounted() {
    this.url = `${repoBaseUrl}/repos/weeklyRivens${this.platform.toUpperCase()}.json`;
    this.getdata();
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    checktitle(title) {
      return title === 'null' ? 'No compatibility returned' : this.capitalizeFirstLetter(title);
    },
    track() {
      this.$ga.page('/riven/data');
    },
    async getdata() {
      const res = JSON.parse((await fetch(this.url).then((res) => res.text())).replace(/NaN/g, 0));

      const rivenData = _.mapValues(_.groupBy(res, 'itemType'), (clist) => clist.map((car) => _.omit(car, 'itemType')));

      Object.keys(rivenData).forEach((key) => {
        rivenData[key] = _.mapValues(_.groupBy(rivenData[key], 'compatibility'), (clist2) =>
          clist2.map((car1) => _.omit(car1, 'compatibility'))
        );
      });
      this.data = rivenData;
      this.loading = false;
    },
  },
};
</script>

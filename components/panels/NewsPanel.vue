<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item class="list-group-item-borderless">
        <b-carousel
          id="infoscreen-carousel"
          :interval="0"
          :value="cycle ? activeElemIndex % filteredNews.length : hover"
          :indicators="false"
          :controls="false"
        >
          <b-carousel-slide v-for="newsitem in filteredNews" :key="`${newsitem.id}-img`">
            <b-img
              slot="img"
              :alt="newsitem.message"
              class="d-block slide-image"
              fluid
              center
              :src="getImgSrc(newsitem.imageLink)"
            />
          </b-carousel-slide>
        </b-carousel>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderless pb-0">
        <b-list-group>
          <b-list-group-item
            v-for="(newsitem, index) in filteredNews"
            :key="`${newsitem.id}-li`"
            :data-news-item="newsitem.id"
            :class="`d-flex py-0 justify-content-between align-items-center list-group-item-borderless ${
              cycle && index === activeElemIndex % filteredNews.length ? 'active' : ''
            } ${hover === index ? 'hover' : ''}`"
            @mouseover="hover = index"
            @focus="hover = index"
          >
            <span class="news-title">
              <b-link target="_blank" rel="noopener" :href="newsitem.link">
                <div class="news-time">{{ title(newsitem).time }}</div>
                <span class="news-label">{{ title(newsitem).label }}</span>
              </b-link>
            </span>
          </b-list-group-item>
        </b-list-group>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom">
        <b-form-checkbox id="news-cycle-checkbox" v-model="check" class="float-right" name="news-cycle-checkbox" switch>
          {{ $t('news.autoprogress') }}
        </b-form-checkbox>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>
<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { mapGetters } from 'vuex';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

const cdnUrl = 'https://cdn.warframestat.us';
const cdnOpts = ['o_webp', 'rs_404x110'];

export default {
  name: 'NewsPanel',
  components: { HubPanelWrap },
  props: ['news'],
  computed: {
    headertext() {
      return this.$t('news.header');
    },
    filteredNews() {
      return this.news.filter((item) => item.translations[this.locale]).reverse();
    },
    check: {
      get() {
        return this.cycle;
      },
      set() {
        this.hover = null;
        this.cycle = !this.cycle;
        this.$store.commit('worldstate/autoProgressNews', [this.cycle]);
      },
    },
    ...mapGetters('worldstate', ['componentState', 'locale']),
    cycle() {
      return this.componentState.news.autoCycle;
    },
  },
  mounted() {
    this.interval = setInterval(this.increment, 3000);
    dayjs.updateLocale('en', {
      relativeTime: {
        future: `${this.$t('news.future')} %s:`,
        past: `%s ${this.$t('news.past')}:`,
        s: '%ds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1m',
        MM: '%dm',
        y: '1y',
        yy: '%dy',
      },
    });
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  beforeUpdate() {
    clearInterval(this.interval);
    this.interval = undefined;
  },
  updated() {
    if (!this.interval) {
      this.interval = setInterval(this.increment, 3000);
    }
  },
  methods: {
    increment() {
      if (this.cycle) {
        this.activeElemIndex++;
      }
    },
    open: function (url) {
      window.open(url, '_blank');
      this.increment();
    },
    getImgSrc: (url) => {
      return `${cdnUrl}/${cdnOpts.join(',')}/${url}`;
    },
    title: function (newsitem) {
      if (newsitem.startDate && newsitem.endDate) {
        if (dayjs(newsitem.startDate).unix() > dayjs().unix()) {
          return {
            time: dayjs(newsitem.startDate).fromNow(),
            label: newsitem.translations[this.locale],
          };
        } else if (dayjs(newsitem.endDate).unix() > dayjs().unix()) {
          return {
            time: `${this.$t('news.live')}:`,
            label: newsitem.translations[this.locale],
          };
        } else {
          return {
            time: dayjs(newsitem.endDate).fromNow(),
            label: newsitem.translations[this.locale],
          };
        }
      } else {
        return {
          time: dayjs(newsitem.date).fromNow(),
          label: newsitem.translations[this.locale],
        };
      }
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      activeElemIndex: 0,
      interval: {},
      hover: null,
    };
  },
};
</script>
<style scoped>
.list-group-item.active .news-title a,
.list-group-item.hover .news-title a {
  font-weight: normal;
  color: white;
}

.list-group-item.active + .hover .news-title a {
  color: grey;
}

.list-group-item.active .news-title a:hover {
  font-weight: normal;
  color: grey;
}

.list-group .list-group .list-group-item {
  padding-top: 0px;
  padding-right: 0px;
  padding-left: 0px;
}

.news-title {
  text-align: left;
}

.news-time {
  width: 5em;
  float: left;
}
</style>

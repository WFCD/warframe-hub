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
            <b-img slot="img" class="d-block slide-image" fluid center :src="getImgSrc(newsitem.imageLink)" />
          </b-carousel-slide>
        </b-carousel>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderless pb-0">
        <b-list-group>
          <b-list-group-item
            :data-news-item="newsitem.id"
            :key="`${newsitem.id}-li`"
            :class="
              `d-flex py-0 justify-content-between align-items-center list-group-item-borderless ${
                cycle && index === activeElemIndex % filteredNews.length ? 'active' : ''
              } ${hover === index ? 'hover' : ''}`
            "
            v-for="(newsitem, index) in filteredNews"
            @mouseover="hover = index"
          >
            <span class="news-title">
              <b-link target="_blank" rel="noopener" :href="newsitem.link">
                <div class="news-time">{{ title(newsitem).time }} ago:</div>
                <span class="news-label">{{ title(newsitem).label }}</span>
              </b-link>
            </span>
          </b-list-group-item>
        </b-list-group>
      </b-list-group-item>
      <b-list-group-item class="list-group-item-borderbottom">
        <b-form-checkbox id="news-cycle-checkbox" class="float-right" name="news-cycle-checkbox" switch v-model="check">
          Auto-progress
        </b-form-checkbox>
      </b-list-group-item>
    </b-list-group>
  </HubPanelWrap>
</template>
<style scoped>
.list-group .list-group {
  margin: 0 -5px -5px -5px;
}

body .list-group .list-group-item-borderbottom {
  margin: 0;
}

body .list-group .list-group-item-borderless .list-group {
  margin-left: auto;
  margin-right: auto;
  display: inline-block;
}

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
  width: 4em;
  float: left;
}
</style>
<script>
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
  props: ['news'],
  name: 'NewsPanel',
  components: { HubPanelWrap },
  computed: {
    headertext() {
      return 'News';
    },
    filteredNews() {
      return this.news.filter((item) => item.translations['en']).reverse();
    },
    check: {
      get() {
        return this.cycle;
      },
      set() {
        this.hover = null;
        this.cycle = !this.cycle;
        this.$store.commit('autoProgressNews', [this.cycle]);
      },
    },
  },
  methods: {
    increment() {
      if (this.cycle) {
        this.activeElemIndex++;
      }
    },
    open: function(url) {
      window.open(url, '_blank');
      this.increment();
    },
    getImgSrc: (url) => {
      return 'https://cdn.warframestat.us/o_webp,rs_404x110/' + url;
    },
    title: (newsitem) => ({
      time: newsitem.eta.split(' ')[0],
      label: newsitem.translations['en'],
    }),
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
      },
      activeElemIndex: 0,
      interval: {},
      cycle: this.$store.getters.componentState.news.autoCycle,
      hover: null,
    };
  },
  mounted() {
    this.interval = setInterval(this.increment, 3000);
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
};
</script>

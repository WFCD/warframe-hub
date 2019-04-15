<template>
  <div class=" max-w-md  h-auto rounded overflow-hidden  border-transparent">
    <div class="font-bold text-4xl mt-1 bg-transparent ">News</div>
    <div class="bg-page shadow-lg" style="height: 300px">
      <hooper style="height: 300px" :autoPlay="true" :playSpeed="4000">
        <slide
          class="bg-cover relative bg-center bg-no-repeat max-w-full"
          v-for="(newsitem, index) in news"
          v-if="newsitem.translations['en']"
          :key="index"
          :style="{
            height: '300px',
            'background-image': 'url(' + getimgling(newsitem.imageLink) + ')'
          }"
        >
          <div
            class="w-full  bottom-0 bg-transparent absolute pl-3 pr-6"
            style="background-color: rgba(64,64,64,.7)!important"
          >
            <div class=" text-left text-white font-bold mb-2">
              <div v-on:click="open(newsitem.link)">
                {{ title(newsitem)[0] }}<br />
                {{ title(newsitem)[1] }}
              </div>
            </div>
          </div>
        </slide>
        <hooper-navigation slot="hooper-addons"></hooper-navigation> </hooper
      ><!--  -->
    </div>
  </div>
</template>
<style>
.carousel-caption {
  background-color: rgba(64, 64, 64, 0.7) !important;
  color: white;
  width: 100% !important;
  left: 0 !important;
  bottom: 0 !important;
  font-weight: bolder;
  padding-bottom: 0px !important;
}
.carousel-caption a {
  color: white;
}
.carousel-item {
  max-height: 250px;
  min-height: 230px;
}

.middling-helper {
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
</style>
<script>
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper';
import 'hooper/dist/hooper.css';

export default {
  components: {
    Hooper,
    Slide,
    HooperNavigation
  },
  props: ['news'],
  name: 'NewsPanel',
  computed: {
    headertext() {
      return 'News';
    }
  },
  methods: {
    open: function(url) {
      window.open(url, '_blank');
    },
    getimgling: function(url) {
      return 'https://img.mybitti.de/o_webp/' + url;
    },
    title: function(newsitem) {
      var news1 = newsitem.eta.split(' ')[0] + ' ago:';
      var news2 = newsitem.translations['en'];
      return [news1, news2];
    }
  },
  data() {
    return {
      styleObject: {
        display: 'inline'
      }
    };
  }
};
</script>

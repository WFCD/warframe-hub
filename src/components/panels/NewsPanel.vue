<template>
  <div class=" max-w-md  h-auto rounded overflow-hidden  border-transparent">
    <div class="font-bold text-4xl mt-1 bg-transparent ">News</div>
    <div class="bg-page shadow-lg">
      <vue-glide
        style="height: 300px"
        type="carousel"
        :bullet="false"
        :perView="1"
      >
        <vue-glide-slide
          class="bg-cover relative bg-center bg-no-repeat max-w-full"
          v-for="(newsitem, index) in news"
          v-if="newsitem.translations['en']"
          :style="{
            height: '300px',
            'background-image': 'url(' + getimgling(newsitem.imageLink) + ')'
          }"
          :key="index"
        >
          <div alt="Sunset in the mountains" />
          <div
            class="w-full  bottom-0 bg-transparent absolute pl-3 pr-6"
            style="background-color: rgba(64,64,64,.7)!important"
          >
            <div class=" text-left text-white font-bold mb-2">
              <div v-on:click="open(newsitem.link)">
                {{ title(newsitem)[0] }}<br />
                {{ title(newsitem)[1] }}
              </div>
              <div
                class="mr-10 ml-32 sticky text-white font-bold mb-2"
                data-glide-el="controls"
              >
                <button data-glide-dir="<">&#60;prev&nbsp;</button>
                <button data-glide-dir=">">&nbsp;next&#62;</button>
              </div>
            </div>
          </div>
        </vue-glide-slide>

        tttt
      </vue-glide>
      <!-- <b-carousel
      id="infoscreen-carousel"
      :interval="9000"
      :indicators="false"
      :controls="true"
    ></b-carousel>-->
      <!-- <b-img
        slot="img"
        class="d-block slide-image"
        fluid
        center
        :src="getimgling(newsitem.imageLink)"
        :alt="title(newsitem)"
      />-->
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
export default {
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

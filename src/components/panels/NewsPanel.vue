<template>
  <b-col md="6" class="panel-header">
    <h3 class="text-center">{{headertext}}</h3>
    <b-carousel id="infoscreen-carousel" :interval="9000" :indicators="false" :controls="true">
      <b-carousel-slide
        v-for="(newsitem,index) in news"
        :key="index"
        v-if="newsitem.translations['en']"
        :text="title(newsitem)"
        v-on:click.native="open(newsitem.link)"
      >
        <b-img
          slot="img"
          class="d-block slide-image"
          fluid
          center
          :src="newsitem.imageLink.replace('http://', 'https://')"
          alt="image slot"
        />
      </b-carousel-slide>
    </b-carousel>
  </b-col>
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
.slide-image {
  max-height: 250px !important;
  min-height: 230px !important;
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
      return `${newsitem.eta.split(' ')[0]} ago: ${
        newsitem.translations['en']
      }`;
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

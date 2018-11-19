<template>
  <b-col md="6">
        <h3 class="text-center">{{headertext}}</h3>
        <b-carousel id="infoscreen-carousel" :interval="9000" :indicators="false" :controls="true">
          <b-carousel-slide   v-for="(newsitem,index) in news" :key="index"
          v-if="newsitem.translations['en']"
          :text="newsitem.translations['en']">
          <b-img slot="img" class="d-block slide-image" fluid center 
          :src="newsitem.imageLink" alt="image slot"/>
            <p>
            Posted: {{newsitem.eta}} | More Info: <a :href="newsitem.link" target="_blank">Click</a>
            </p>
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
  padding-bottom: 0px !important
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
  data() {
    return {
      styleObject: {
        display: 'inline'
      }
    };
  }
};
</script>
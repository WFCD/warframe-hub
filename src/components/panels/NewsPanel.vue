<template>
  <b-col md="6">
        <h3 class="text-center">{{headertext}}</h3>
        <b-carousel id="infoscreen-carousel" :interval="9000" :indicators="false" :controls="true">
          <b-carousel-slide   v-for="(newsitem,index) in news" :key="index"
          v-if="newsitem.translations['en']"
          :text="newsitem.translations['en']">
          <img slot="img" class="d-block w-100" width="1024" height="250"
          :src="newsitem.imageLink" alt="image slot">
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
  left: 0;
  bottom: 0;
  font-weight: bolder;
  padding-bottom: 0;
}
.carousel-caption a {
  color: white;
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
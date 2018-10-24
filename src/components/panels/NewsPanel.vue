<template>
  <b-col md="6">
        <h3 class="text-center">{{headertext}}</h3>
        <b-carousel id="infoscreen-carousel" :interval="9000" :indicators="false" :controls="true">
          <b-carousel-slide   v-for="(newsitem,index) in news" :key="index"
          v-if="newsitem.translations['en']"
          :text="newsitem.translations['en']">
          <img slot="img" class="d-block   w-100" width="1024" height="250"
          :src="newsitem.imageLink" alt="image slot">
          <p style="color: 'black'!important">
            <b>Posted: {{newsitem.eta}} | More Info: <a :href="newsitem.link" target="_blank">Click</a>
            </b>
          </p>
        </b-carousel-slide>
      </b-carousel>
    </b-col>
</template>
<style>
  .carousel-caption {
    background-color: rgba(248, 247, 216, 0.6) !important;
    color: black !important;
    width: 100% !important;
    left: 0 !important;
    bottom: 0 !important;
    font-weight: bolder !important;
    padding-bottom: 0 !important;
  }
  .carousel-caption a {
    color: black !important;
  }
</style>
<script>
  export default {
    props: ['news'],
    name: 'NewsPanel',
    computed: {
      headertext() {
        return 'News'
      }
    },
    data() {
      return {
        styleObject: {
          display: 'inline'
        }
      }
    },
  }
</script>

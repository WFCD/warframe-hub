<template>
  <div id="app">
    <Navbar />
    <router-view/>
    <Footer />
  </div>
</template>

<style>
  #app {
    font-family: "Lato","Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 15px;
    line-height: 1.42857143;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #bbbbbb;
    margin-top: 75px;
  }

  body a {
    color: rgb(171, 171, 171);
  }

  body a:hover {
    text-decoration: none;
  }

  body {
    background-color: #23272A;
  }

  body .list-group .list-group-item-borderless {
    border: none !important;
  }

  body .list-group .list-group-item-borderbottom {
    border-style: solid;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 2px solid #1A5072 !important;
  }

  body .list-group h3 {
    color: white;
  }

  h1, h2, h3, h4 {
    clear: both;
  }

  .pull-right {
    float: right;
  }

  .pull-left {
    float: left;
  }

  .list-group .list-group-item {
    background-color: #2C2F33;
  }

  span.badge-info {
    background-color: #004d80;
  }

  .badge {
    padding: .2em .6em .3em;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }

  /* Bootstrap overrides */
  .dropdown-item:hover, .dropdown-item:focus {
    color: #00bd8e!important;
    background-color: transparent!important;
  }

  @media only screen and (min-width: 700px){
    .navbar.fixed-top {
      height: 60px;
    }
  }

  .navbar.fixed-bottom {
    height: 30px;
  }

  .row {
    display: inline;
  }

</style>

<script>
  import Navbar from '@/components/Navbar.vue';
  import Footer from '@/components/Footer.vue';

  export default {
    name: 'app',
    components: {
      Navbar,
      Footer
    }
  };

</script>

<template>
  <div id="app">
    <Navbar />
    <router-view/>
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

  /* Bootstrap overrides */
  .dropdown-item:hover, .dropdown-item:focus {
    color: #00bd8e!important;
    background-color: transparent!important;
  }

  </style>

  <script>
  import Navbar from '@/components/Navbar.vue'

  export default {
    name: 'app',
    components: {
      Navbar
    }
  }

</script>

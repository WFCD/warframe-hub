<template>
  <b-navbar toggleable="md" type="dark" fixed="bottom" class="navbar-footer" variant="dark">
    <b-row>
      <b-col lg="12" id="footer-content" :style="autoCenter">
        <a name="Copyright Warframe Community Devs" href="#credits" data-target="#wfcd" data-toggle="modal" style="outline:none;">
          <i class="far fa-copyright"></i> 2018 WFCD</a>
        <span> | </span>
        <a name="License" href="#license" data-target="#license" data-toggle="modal" style="outline:none;">License</a>
        <span> | </span>
        <a name="Discord" href="https://discord.gg/jGZxH9f" rel="noopener" target="_blank">Discord</a>
      </b-col>
    </b-row>
  </b-navbar>
</template>

<script>
export default {
  name: 'Footer',
  components: {},
  data() {
    return {
      autoCenter: {
        'margin-left': 'auto',
        'margin-right': 'auto'
      }
    }
  }
}
</script>

<style>
.navbar.bg-dark {
  background-color:#303030 !important;
}

.navbar-footer {
  bottom: 0;
  width: 100%;
  height: 31px;
}
</style>

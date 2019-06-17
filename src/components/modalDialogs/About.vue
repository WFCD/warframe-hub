<template>
  <b-modal id="about-modal" centered size="lg" title="About">
    <b-tabs>
      <b-tab title="Community Devs">
        <br />This project is part of the Warframe Community Developers.<br />
        <a name="Warframe Hub Github" href="https://github.com/WFCD/warframe-hub" rel="noopener" target="_blank">
          Click here to view GitHub project.</a
        >
        <br /><br />
        <a name="Warframe Comm Dev Github" rel="noopener" target="_blank" href="https://github.com/WFCD">
          <img
            class="wfcd-banner img-rounded"
            style="padding: 10px 10px 10px 10px"
            src="https://warframestat.us/wfcd.png"
        /></a>
        <br /><br />
        Pull requests are welcome, please submit any issues found to the project's
        <a name="Hub Issues" rel="noopener" target="_blank" href="https://github.com/WFCD/warframe-hub/issues">
          issue tracker</a
        >.
      </b-tab>
      <b-tab title="License">
        <br />Concepted and Crafted by developers from the
        <a href="https://github.com/wfcd" target="_blank" rel="noopener">Warframe Community Developers</a>.
        <br /><br />The Warframe Hub project is committed to open source. This project is licensed and distributed under
        <a name="Apache License" rel="noopener" target="_blank" href="https://www.apache.org/licenses/LICENSE-2.0">
          Apache License 2.0</a
        >
        <br /><br />
        Warframe and the Warframe logo are registered trademarks of Digital Extremes Ltd. Warframe Hub is not affiliated
        with Digital Extremes Ltd. in any way. <br /><br />
        You are entitled to a copy of this project AS IS, and you are free to modify it to your heart's desires. You
        must include a copy of this license to all future modification and releases. You can read more about the terms
        of the
        <a name="Apache License" rel="noopener" target="_blank" href="https://choosealicense.com/licenses/apache-2.0/">
          license here</a
        >.<br /><br />
        If you have any issues with timers loading oddly or information displaying strangely, the first and easiest
        debugging is to clear your cache.
        <br />
        You can find helpful tips how to do this
        <a name="Refresh Your Cache" href="http://www.refreshyourcache.com/en/home/">
          here.
        </a>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
export default {
  name: 'AboutModal',
  components: {},
};
</script>

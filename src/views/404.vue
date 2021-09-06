<template>
  <div class="container">
    <br /><br />
    <div class="row">
      <div class="col-md-4">
        <img class="wfcd-logo" name="WFCD Logo" :src="wfcdLogo" alt="WFCD Logo" style="filter: invert(0.7)" />
      </div>

      <div class="col-md-8">
        <h1>404 ERROR OH NO</h1>
        <h2>You broke the site!</h2>
        <h3>How could you?</h3>

        <br /><br />
        <p>Don't worry, one of the developers will clean up the mess. You can carry on though!</p>
        <p>This interaction will be logged, so we can solve the problem faster.</p>
        <p>Speaking of which, one of the developers is probably panicking right now just because of this error log.</p>
        <p>Oh well, poor him.</p>
        <br /><br />
        <a name="Main Page" href="/">Click here to return to a safe place</a>
      </div>
    </div>
  </div>
</template>

<script>
import { cdn } from '@/utilities';

const wfcdLogo = cdn('svg/wfcd.svg');

export default {
  name: '404',
  data() {
    return {
      wfcdLogo,
    };
  },
};
</script>

<!-- script>
  /*globals SVGInjector */
  SVGInjector(document.querySelectorAll('img.wfcd-logo'));
</script -->

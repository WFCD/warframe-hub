<template>
  <div>
    <div class="flex flex-wrap xl:px-1">
      <TimePanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 px-1 h-64"
        :timer="worldstate.earthCycle"
        type="Earth"
      />
      <TimePanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 px-1 h-64"
        :timer="worldstate.cetusCycle"
        type="Cetus"
      />
      <TimePanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 px-1 h-64"
        :timer="worldstate.vallisCycle"
        type="Vallis"
      />
      <BountyPanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 px-1 h-64"
        :syndicatedata="ostron"
        syndicate="Ostron"
      />
      <BountyPanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 px-1 h-64"
        :syndicatedata="solaris"
        syndicate="Solaris"
      />
    </div>
  </div>
</template>

<script>
import TimePanel from '~/components/Panels/TimePanel.vue'
import BountyPanel from '~/components/Panels/BountyPanel.vue'

import { mapGetters } from 'vuex'

export default {
  components: {
    TimePanel,
    BountyPanel
  },
  computed: mapGetters({
    worldstate: 'worldstate',
    ostron: 'ostronSyndicate',
    solaris: 'solarisSyndicate',
    platform: 'platform'
  })
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

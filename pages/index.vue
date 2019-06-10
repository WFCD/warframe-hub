<template>
  <div>
    <div class="flex flex-wrap xl:px-1">
      <TimePanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-1 h-64"
        :timer="worldstate.earthCycle"
        type="Earth"
      />
      <TimePanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-1 h-64"
        :timer="worldstate.cetusCycle"
        type="Cetus"
      />
      <TimePanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-1 h-64"
        :timer="worldstate.vallisCycle"
        type="Vallis"
      />
      <BountyPanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-1 h-64"
        :syndicatedata="ostron"
        syndicate="Ostron"
      />
      <BountyPanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-1 h-64"
        :syndicatedata="solaris"
        syndicate="Solaris"
      />
      <InvasionsPanel
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mx-1 h-64"
        :invasions="worldstate.invasions"
      />
    </div>
  </div>
</template>

<script>
import TimePanel from '~/components/Panels/TimePanel.vue'
import BountyPanel from '~/components/Panels/BountyPanel.vue'
import InvasionsPanel from '~/components/Panels/Invasions.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Timers',
  components: {
    TimePanel,
    BountyPanel,
    InvasionsPanel
  },
  computed: mapGetters({
    worldstate: 'worldstate',
    ostron: 'ostronSyndicate',
    solaris: 'solarisSyndicate',
    platform: 'platform'
  })
}
</script>

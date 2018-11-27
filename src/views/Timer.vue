<template>
  <div class="timers">
    <b-container fluid>
      <b-row>
        <AcolytesPanel v-if="this.$store.getters.componentState.acolytes.state" :acolytes="this.$store.getters.worldstate.persistentEnemies" />
        <ResetPanel v-if="this.$store.getters.componentState.reset.state" />
        <AlertPanel v-if="this.$store.getters.componentState.alerts.state" :alerts="this.$store.getters.worldstate.alerts"/>
        <NewsPanel v-if="this.$store.getters.componentState.news.state" :news="this.$store.getters.worldstate.news" />
        <TimePanel v-if="this.$store.getters.componentState.earth.state" :time="this.$store.getters.worldstate.earthCycle" location="Earth" />
        <TimePanel v-if="this.$store.getters.componentState.cetus.state" :time="this.$store.getters.worldstate.cetusCycle" location="Cetus" />
        <TimePanel v-if="this.$store.getters.componentState.vallis.state" :time="this.$store.getters.worldstate.vallisCycle" location="Vallis" />
        <SortiePanel v-if="this.$store.getters.componentState.sortie.state" :sortie="this.$store.getters.worldstate.sortie"/>
        <FissuresPanel v-if="this.$store.getters.componentState.fissures.state" :fissures="this.$store.getters.worldstate.fissures"/>
        <BountyPanel v-if="this.$store.getters.componentState.bounties" :syndicate="this.ostrons" type="Ostron" />
        <BountyPanel v-if="this.$store.getters.componentState['solaris-bounties']" :syndicate="this.solaris" type="Solaris United" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AlertPanel from '@/components/panels/AlertPanel.vue';
import NewsPanel from '@/components/panels/NewsPanel.vue';
import TimePanel from '@/components/panels/TimePanel.vue';
import ResetPanel from '@/components/panels/ResetPanel.vue';
import SortiePanel from '@/components/panels/SortiePanel.vue';
import AcolytesPanel from '@/components/panels/AcolytesPanel.vue';
import FissuresPanel from '@/components/panels/FissuresPanel.vue';
import BountyPanel from '@/components/panels/BountyPanel.vue';

export default {
  name: 'timers',
  components: {
    AlertPanel,
    NewsPanel,
    TimePanel,
    ResetPanel,
    SortiePanel,
    AcolytesPanel,
    FissuresPanel,
    BountyPanel,
  },
  methods: {
    track () {
      this.$ga.page('/');
    },
  },
  computed: {
    ostrons: function() {
      const filtered = this.$store.getters.worldstate.syndicateMissions
        .filter(syndicate => syndicate.syndicate === 'Ostrons');
      return filtered[0];
    },
    solaris: function() {
      const filtered = this.$store.getters.worldstate.syndicateMissions
        .filter(syndicate => syndicate.syndicate === 'Solaris United');
      return filtered[0];
    },
  }
};
</script>

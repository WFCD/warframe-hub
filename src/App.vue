<template>
  <div id="app">
    <notifications group="hub" :max="5" :duration="30000" position="bottom right" />
    <Navbar />
    <Settings />
    <About />
    <router-view />
    <b-toast
      id="update-time"
      :visible="updateExists"
      variant="info"
      :title="$t('updates.header')"
      :auto-hide-delay="60000"
    >
      {{ $t('updates.body') }}
      <b-btn class="pull-right mt-n1" size="sm" @click="refreshApp" variant="outline-primary">{{
        $t('updates.btn')
      }}</b-btn>
    </b-toast>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Settings from '@/components/modalDialogs/Settings.vue';
import About from '@/components/modalDialogs/About.vue';
import themes from '@/assets/json/themes.json';
import { mapGetters } from 'vuex';
import update from '@/mixins/update';

export default {
  name: 'app',
  components: {
    Navbar,
    Settings,
    About,
  },
  mixins: [update],
  computed: {
    ...mapGetters('worldstate', {
      rawTheme: 'theme',
    }),
    theme() {
      return themes.find((theme) => theme.key === this.rawTheme).className;
    },
  },
  watch: {
    theme(newTheme, oldTheme) {
      oldTheme.split(' ').forEach((ot) => document.body.classList.remove(ot));
      newTheme.split(' ').forEach((nt) => document.body.classList.add(nt));
    },
  },
  mounted: function () {
    this.theme.split(' ').forEach((t) => document.body.classList.add(t));
  },
};
</script>

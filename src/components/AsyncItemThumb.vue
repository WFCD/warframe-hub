<template>
  <span>
    <div v-if="!img">{{ this.alt }}</div>
    <div v-else>
      <img :src="img" :alt="this.alt" :id="this.id" class="async-thumb" :width="`${this.width}px`" />
      <b-tooltip :target="this.id" triggers="hover" placement="bottom">
        <img :src="img" :alt="this.alt" :id="this.id" class="async-thumb" :width="`${this.width * 5}px`" />
        <div>{{ this.alt }}</div>
      </b-tooltip>
    </div>
  </span>
</template>

<style scoped>
.async-thumb {
  pointer-events: inherit;
}
</style>

<script>
import fetch from 'node-fetch';
import utilities from '@/utilities';

export default {
  name: 'item-thumb',
  props: {
    alt: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 20,
    },
    ikey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: utilities.makeid(),
      img: null,
    };
  },
  methods: {
    fetch: async function () {
      const stripped = (this.ikey || this.alt)
        .replace(/\d+\s+/i, '')
        .replace('Blueprint', '')
        .replace('Receiver', '')
        .replace('Hilt', '')
        .replace('Blade', '')
        .replace('Stock', '')
        .trim();
      const url = `https://api.warframestat.us/items/search/${stripped.toLowerCase()}`;
      const data = (await fetch(url).then((d) => d.json())).filter((d) => d.name === stripped);
      if (!data || !data[0]?.imageName || '') {
        return;
      } else {
        this.img = `https://cdn.warframestat.us/o_webp,progressive_true,rs_${
          this.width * 8
        }/https://cdn.warframestat.us/img/${data[0].imageName}`;
      }
    },
  },
  created: function () {
    this.fetch();
  },
};
</script>

<template>
  <span>
    <div v-if="!img">{{ alt }}</div>
    <div v-else>
      <img :id="id" :src="img" :alt="alt" class="async-thumb" :width="`${width}px`" />
      <b-tooltip :target="id" triggers="hover" placement="bottom">
        <img :id="id" :src="img" :alt="alt" class="async-thumb" :width="`${width * 5}px`" />
        <div>{{ alt }}</div>
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
import utilities from '@/services/utilities';

export default {
  name: 'ItemThumb',
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
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
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
        // empty on purpose?
      } else {
        this.img = `https://cdn.warframestat.us/o_webp,progressive_true,rs_${
          this.width * 8
        }/https://cdn.warframestat.us/img/${data[0].imageName}`;
      }
    },
  },
};
</script>

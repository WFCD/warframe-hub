<template>
  <b-card no-body :header="item.name">
    <b-card-img :src="wfcdn(item.imageName)" :alt="item.name" top />
    <b-card-body>
      <b-card-text>
        <slot name="t1">
          {{ description || item.description || '' }}
        </slot>
      </b-card-text>
      <b-card-text>
        <slot name="t2"></slot>
      </b-card-text>
      <b-button v-if="link" :href="link" target="_blank" variant="primary"> Wiki <i class="fas fa-link" /> </b-button>
      <b-button v-else @click="modal.open()"> Wiki <i class="fas fa-link" /> </b-button>
      <b-button v-if="!!link2" :href="link2.a" target="_blank" variant="primary">
        {{ link2.title }} <i class="fas fa-link" />
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
import { cdn, wfcdn, optimize } from '@/services/utilities';

export default {
  name: 'CodexCard',
  props: {
    item: Object,
    description: String,
    link: String,
    link2: Object,
  },
  methods: {
    cdn,
    wfcdn,
    optimize,
  },
};
</script>

<style scoped></style>

<template>
  <HubPanelWrap :title="headertext" class="kuvas">
    <b-list-group>
      <b-list-group-item
        :style="styleObject"
        v-for="(kuva, index) in kuvas"
        :key="kuva.solnode + kuva.activation"
        v-bind:class="{
          'list-group-item-borderless': index !== kuvas.length - 1,
          'pb-0': index !== kuvas.length - 1,
          'list-group-item-borderbottom': index === kuvas.length - 1,
        }"
      >
        <span class="pull-left">
          <HubImg
            :src="kuvalogo"
            name="Kuva Siphon"
            class="li-mission-decorator li-mission-decorator-lg"
            height="15px"
            width="15px"
          />
          <b>{{ kuva.node }}</b> | {{ kuva.enemy }} - {{ kuva.type }}
        </span>
        <TimeBadge
          v-if="index === 0"
          :starttime="kuva.activation"
          :endtime="kuva.expiry"
          :interval="1000"
          style="padding: 5px;"
        />
      </b-list-group-item>
      <NoDataItem v-if="kuvas.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.vue';
import HubImg from '@/components/HubImg.vue';
import NoDataItem from '@/components/NoDataItem.vue';
import HubPanelWrap from '@/components/HubPanelWrap';

/**
 * To any poor soul who decides to work on this in the future.
 * At the time of writing, Digital Extremes has not exposed any way for us to get Kuva Siphon mission data.
 * This data is being fetched from semlar's EE.log scraper located at 10o.io/kuvalog.json
 * And even with that, we cannot tell which mission is a flood mission out of all the active missions.
 * I hope this will change in the future. If not, 3rd party development is doomed.
 */

import kuvalogo from '@/assets/img/kuva/kuva.svg';
//import flood from '@/assets/img/kuva/kuvaflood.svg';

export default {
  name: 'Kuvas',
  props: ['kuvas'],
  computed: {
    headertext() {
      return 'Kuva Siphons';
    },
    kuvalogo() {
      return kuvalogo;
    },
  },
  data() {
    return {
      styleObject: {
        display: 'inline',
        'vertical-align': 'middle',
      },
    };
  },
  components: {
    TimeBadge,
    HubImg,
    NoDataItem,
    HubPanelWrap,
  },
};
</script>

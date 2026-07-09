<template>
  <HubPanelWrap :title="headertext" class="kuvas">
    <b-list-group>
      <b-list-group-item
        v-for="(kuva, index) in kuvas"
        :key="kuva.node + kuva.activation"
        :style="styleObject"
        :class="{
          'list-group-item-borderless': index !== kuvas.length - 1,
          'pb-0': index !== kuvas.length - 1,
          'list-group-item-borderbottom': index === kuvas.length - 1,
        }"
      >
        <span class="pull-left">
          <HubImg
            :src="kuvalogo"
            :name="$t('kuva.siphon')"
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
          style="padding: 5px"
        />
      </b-list-group-item>
      <NoDataItem v-if="kuvas.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
import TimeBadge from '@/components/TimeBadge.jsx';
import HubImg from '@/components/HubImg.jsx';
import NoDataItem from '@/components/NoDataItem.jsx';
import HubPanelWrap from '@/components/HubPanelWrap.jsx';

/**
 * To any poor soul who decides to work on this in the future.
 * At the time of writing, Digital Extremes has not exposed any way for us to get Kuva Siphon mission data.
 * This data is being fetched from semlar's EE.log scraper located at 10o.io/kuvalog.json
 * And even with that, we cannot tell which mission is a flood mission out of all the active missions.
 * I hope this will change in the future. If not, 3rd party development is doomed.
 */

import { cdn } from '@/services/utilities';
const kuvalogo = cdn('svg/kuva/kuva.svg');
// import flood from cdn('svg/kuva/kuvaflood.svg');

export default {
  name: 'KuvaPanel',
  components: {
    TimeBadge,
    HubImg,
    NoDataItem,
    HubPanelWrap,
  },
  props: ['kuvas'],
  data() {
    return {
      styleObject: {
        display: 'inline',
        'vertical-align': 'middle',
      },
    };
  },
  computed: {
    headertext() {
      return this.$t('kuva.header');
    },
    kuvalogo() {
      return kuvalogo;
    },
  },
};
</script>

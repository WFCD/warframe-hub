<template>
  <HubPanelWrap :title="headertext">
    <b-list-group>
      <b-list-group-item :style="styleObject" v-for="(challenge, index) in nightwave.activeChallenges" :key="challenge.id"
      v-bind:class="{ 'list-group-item-borderless': index !== nightwave.activeChallenges.length - 1,
        'list-group-item-borderbottom': index === nightwave.activeChallenges.length - 1 }">
        <span v-b-tooltip.right :title="challenge.desc" class="pull-left">
          <HubImg
            :src="challenge.isDaily ? daily : (challenge.isElite ? elite : weekly)"
            :name="challenge.isDaily ? 'Daily' : (challenge.isElite ? 'Elite Weekly' : 'Weekly')"
            class="li-mission-decorator li-mission-decorator-lg invert"
            :height="challenge.isDaily ? '20px' : '32px'"
            width="32px"
            />
          {{challenge.title}}
        </span>
        <TimeBadge :starttime="challenge.activation" :endtime="challenge.expiry" :interval="1000"/>
      </b-list-group-item>
      <NoDataItem v-if="nightwave.activeChallenges.length === 0" :text="headertext" />
    </b-list-group>
  </HubPanelWrap>
</template>

<script>
  import TimeBadge from '@/components/TimeBadge.vue';
  import NoDataItem from '@/components/NoDataItem.vue';
  import HubPanelWrap from '@/components/HubPanelWrap';
  import HubImg from '@/components/HubImg';

  import daily from '@/assets/img/nightwave/daily.png';
  import weekly from '@/assets/img/nightwave/weekly.png';
  import elite from '@/assets/img/nightwave/elite.png';

  export default {
    name: 'Nightwave',
    props: ['nightwave'],
    computed: {
      headertext() {
        return 'Nightwave';
      },
    },
    data () {
      return {
        styleObject: {
          display: 'inline',
        },
        daily: daily,
        weekly: weekly,
        elite: elite,
      };
    },
    components: {
      TimeBadge,
      NoDataItem,
      HubPanelWrap,
      HubImg,
    }
  };
</script>

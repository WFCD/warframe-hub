<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <nuxt-link to="vallis-map">
          <b-button variant="info" class="mb-3 float-right">Orb Vallis Map</b-button>
        </nuxt-link>
        <nuxt-link to="vallis-fish0howto#hotspots">
          <b-button variant="info" class="mb-3 mr-3 float-right">What is a Hotspot?</b-button>
        </nuxt-link>
      </b-col>
    </b-row>

    <b-row>
      <b class="mx-auto" style="color: firebrick">
        All servofish requires either Shockprod or Stunna Fishing Spear for effective capture
      </b>
      <b-table
        striped
        responsive
        hover
        :items="fish"
        :fields="fields"
        class="fish-info b-table mx-3"
        primary-key="name"
        sticky-header="60vh"
      >
        <template #cell(small)="data">
          {{ data.item.small.resources.scrap }}
          <FishImg type="common" item="scrap" title="Scrap" width="20" />
          / {{ data.item.small.standing }}
          <FishImg
            type="common"
            item="standing"
            name="Solaris United Standing"
            title="Solaris United Standing"
            width="15"
            invert="true"
          />
        </template>
        <template #cell(medium)="data">
          {{ data.item.medium.resources.scrap }}
          <FishImg type="common" item="scrap" title="Scrap" width="20" />
          / {{ data.item.medium.standing }}
          <FishImg
            type="common"
            item="standing"
            name="Solaris United Standing"
            title="Solaris United Standing"
            width="15"
            invert="true"
          />
        </template>
        <template #cell(large)="data">
          {{ data.item.large.resources.scrap }}
          <FishImg type="common" item="scrap" title="Scrap" width="20" />
          / {{ data.item.large.standing }}
          <FishImg
            type="common"
            item="standing"
            name="Solaris United Standing"
            title="Solaris United Standing"
            width="15"
            invert="true"
          />
        </template>
        <template #cell(time)="data">
          <span :id="data.item.name + '-time'">
            <i v-if="data.item.time.cold.appear" class="fas fa-lg fa-snowflake" style="color: skyblue" />
            <i v-if="data.item.time.cold.prefer" class="fas fa-lg fa-arrow-left mx-1"></i>
            <i v-if="data.item.time.warm.prefer" class="fas fa-lg fa-arrow-right mx-1"></i>
            <i v-if="data.item.time.warm.appear" class="fas fa-lg fa-sun" style="color: darkorange" />
          </span>
          <b-tooltip :target="data.item.name + '-time'" :title="data.item.time.string" />
        </template>
        <template #cell(rarity)="data">
          <FishImg
            type="common"
            :item="data.item.rarity.slice(2).toLowerCase()"
            :name="data.item.rarity.slice(2)"
            :title="data.item.rarity.slice(2)"
            width="20"
          />
        </template>
        <template #cell(hotspot)="data">
          <i v-if="data.item.hotspot" class="fas fa-lg fa-check-circle" style="color: lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color: salmon" />
        </template>
        <template #cell(moreinfo)="row">
          <div size="sm" class="mr-2" @click="row.toggleDetails">
            <i v-if="row.detailsShowing" class="fas fa-chevron-down"></i>
            <i v-else class="fas fa-chevron-right"></i>
          </div>
        </template>
        <template #row-details="data">
          <b-card>
            <b-row>
              <b-col v-if="data.item.thumb">
                <b-btn :href="data.item.wiki" target="_blank" size="sm" rel="noopener" variant="link">
                  {{ data.item.name }}
                </b-btn>
                <br />
                <FishImg type="fish" :item="data.item.thumb" :title="data.item.name" width="200" />
              </b-col>
              <b-col v-if="data.item.unique.thumb">
                <b-btn :href="data.item.unique.wiki" target="_blank" size="sm" rel="noopener" variant="link">
                  {{ data.item.unique.name }}
                </b-btn>
                <br />
                <FishImg type="parts" :item="data.item.unique.thumb" :title="data.item.unique.name" width="200" />
              </b-col>
              <b-col v-if="data.item.bait.thumb">
                <b>{{ data.item.bait.name }}</b>
                <br />
                <FishImg type="bait" :item="data.item.bait.thumb" :title="data.item.bait.name" width="200" />
              </b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import fish from '@/static/json/fish/vallis.json';
import FishImg from '@/components/FishImg.vue';

const fields = [
  {
    key: 'moreinfo',
    label: '',
    headerTitle: 'Display pictures for fish, unique, and bait type',
  },
  {
    key: 'name',
    label: 'Name',
    headerTitle: 'The name of the fish',
    sortable: true,
  },
  {
    key: 'unique.name',
    label: 'Unique',
    headerTitle: 'Unique item when dismantling - you will receive one regardless of model',
    sortable: true,
  },
  {
    key: 'small',
    label: 'Basic',
    headerTitle: 'Common model - you will get scrap if dismantled or standing if donated',
  },
  {
    key: 'medium',
    label: 'Adorned',
    headerTitle: 'Uncommon model - you will get scrap if dismantled or standing if donated',
  },
  {
    key: 'large',
    label: 'Magnificent',
    headerTitle: 'Rare model - you will get scrap if dismantled or standing if donated',
  },
  {
    key: 'location',
    label: 'Location',
    headerTitle: 'Location of where to find the servofish',
    sortable: true,
  },
  {
    key: 'time.string',
    label: 'Temperature',
    headerTitle: 'Temperature of when you can find the servofish - arrow denotes preference',
    sortable: true,
  },
  {
    key: 'rarity',
    label: 'Rarity',
    headerTitle: 'How likely the fish will spawn',
    sortable: true,
  },
  {
    key: 'bait.name',
    label: 'Bait',
    headerTitle: 'What bait will make this servofish more likely to spawn',
    sortable: true,
  },
  {
    key: 'hotspot',
    label: 'Hotspot Required',
    headerTitle: 'Whether a hotspot is required for this fish to spawn',
    sortable: true,
    formatter: (value) => {
      return value ? 'Yes' : 'No';
    },
  },
  {
    key: 'maximumPoint',
    label: 'Max Points',
    headerTitle: 'The maximum points possible for this fish',
    sortable: true,
  },
];

export default {
  name: 'VallisFishView',
  components: {
    FishImg,
  },
  data() {
    return {
      fish,
      fields,
    };
  },
  methods: {
    track() {
      this.$ga.page('/vallis/fish');
    },
  },
};
</script>

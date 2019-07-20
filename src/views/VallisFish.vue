<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <router-link to="/vallis/map">
          <b-button variant="info" class="mb-3 float-right">Orb Vallis Map</b-button>
        </router-link>
        <router-link to="/vallis/fish/howto#hotspots">
          <b-button variant="info" class="mb-3 mr-3 float-right">What is a Hotspot?</b-button>
        </router-link>
      </b-col>
    </b-row>

    <b-row>
      <b class="mx-auto" style="color:firebrick">
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
      >
        <template slot="small" slot-scope="data">
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
        <template slot="medium" slot-scope="data">
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
        <template slot="large" slot-scope="data">
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
        <template slot="time.string" slot-scope="data">
          <span v-bind:id="data.item.name + '-time'">
            <i v-if="data.item.time.cold.appear" class="fas fa-lg fa-snowflake" style="color:skyblue" />
            <i v-if="data.item.time.cold.prefer" class="fas fa-lg fa-arrow-left mx-1"></i>
            <i v-if="data.item.time.warm.prefer" class="fas fa-lg fa-arrow-right mx-1"></i>
            <i v-if="data.item.time.warm.appear" class="fas fa-lg fa-sun" style="color:darkorange" />
          </span>
          <b-tooltip v-bind:target="data.item.name + '-time'" :title="data.item.time.string" />
        </template>
        <template slot="rarity" slot-scope="data">
          <FishImg
            type="common"
            :item="data.item.rarity.slice(2).toLowerCase()"
            :name="data.item.rarity.slice(2)"
            :title="data.item.rarity.slice(2)"
            width="20"
          />
        </template>
        <template slot="hotspot" slot-scope="data">
          <i v-if="data.item.hotspot" class="fas fa-lg fa-check-circle" style="color:lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color:salmon" />
        </template>
        <template slot="more_info" slot-scope="data">
          <b-button v-if="data.item.thumb" size="sm" @click="data.toggleDetails" class="mr-2">
            <i v-if="data.detailsShowing" class="fas fa-times-circle"></i>
            <i v-else class="fas fa-info-circle"></i>
          </b-button>
        </template>
        <template slot="row-details" slot-scope="data">
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
import fish from '@/assets/json/vallisfish.json';
import FishImg from '@/components/FishImg.vue';

const fields = {
  name: {
    key: 'name',
    label: 'Name',
    headerTitle: 'The name of the fish',
    sortable: true,
  },
  unique: {
    key: 'unique.name',
    label: 'Unique',
    headerTitle: 'Unique item when dismantling - you will receive one regardless of model',
    sortable: true,
  },
  small: {
    label: 'Basic',
    headerTitle: 'Common model - you will get scrap if dismantled or standing if donated',
  },
  medium: {
    label: 'Adorned',
    headerTitle: 'Uncommon model - you will get scrap if dismantled or standing if donated',
  },
  large: {
    label: 'Magnificent',
    headerTitle: 'Rare model - you will get scrap if dismantled or standing if donated',
  },
  location: {
    key: 'location',
    label: 'Location',
    headerTitle: 'Location of where to find the servofish',
    sortable: true,
  },
  time: {
    key: 'time.string',
    label: 'Temperature',
    headerTitle: 'Temperature of when you can find the servofish - arrow denotes preference',
    sortable: true,
  },
  rarity: {
    key: 'rarity',
    label: 'Rarity',
    headerTitle: 'How likely the fish will spawn',
    sortable: true,
  },
  bait: {
    key: 'bait.name',
    label: 'Bait',
    headerTitle: 'What bait will make this servofish more likely to spawn',
    sortable: true,
  },
  hotspot: {
    key: 'hotspot',
    label: 'Hotspot Required',
    headerTitle: 'Whether a hotspot is required for this fish to spawn',
    sortable: true,
    formatter: (value) => {
      return value ? 'Yes' : 'No';
    },
  },
  max_point: {
    key: 'maximumPoint',
    label: 'Max Points',
    headerTitle: 'The maximum points possible for this fish',
    sortable: true,
  },
  more_info: {
    label: 'Info',
    headerTitle: 'Display pictures for fish, unique, and bait type',
  },
};

export default {
  name: 'vallisfish',
  components: {
    FishImg,
  },
  data() {
    return {
      fish: fish,
      fields: fields,
    };
  },
  methods: {
    track() {
      this.$ga.page('/vallis/fish');
    },
  },
};
</script>

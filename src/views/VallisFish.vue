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
      <b-table striped hover :items="fish" :fields="fields" class="fish-info b-table">
        <template slot="more_info" slot-scope="row">
          <b-button size="sm" @click="row.toggleDetails" class="mr-2">
            <i v-if="row.detailsShowing" class="fas fa-times-circle"></i>
            <i v-else class="fas fa-info-circle"></i>
          </b-button>
        </template>
        <template slot="row-details" slot-scope="data">
          <b-card>
            <b-row>
              <b-col>
                <b-btn
                  :href="data.item.wiki"
                  target="_blank"
                  size="sm"
                  rel="noopener"
                  variant="link"
                  v-if="data.item.thumb"
                >
                  {{ data.item.name }}
                </b-btn>
                <br />
                <FishImg
                  type="fish"
                  :item="data.item.thumb"
                  :name="data.item.name"
                  width="200"
                  v-if="data.item.thumb"
                />
                <span v-else>No image available</span>
              </b-col>
              <b-col>
                <b-btn
                  :href="data.item.unique.wiki"
                  target="_blank"
                  size="sm"
                  rel="noopener"
                  variant="link"
                  v-if="data.item.unique.thumb"
                >
                  {{ data.item.unique.name }}
                </b-btn>
                <br />
                <FishImg
                  type="parts"
                  :item="data.item.unique.thumb"
                  :name="data.item.unique.name"
                  width="200"
                  v-if="data.item.unique.thumb"
                />
                <span v-else>No image available</span>
              </b-col>
              <b-col>
                <b>{{ data.item.bait.name }}</b>
                <br />
                <FishImg
                  type="bait"
                  :item="data.item.bait.thumb"
                  :name="data.item.bait.name"
                  width="200"
                  v-if="data.item.bait.thumb"
                />
                <span v-else>No image available</span>
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
    label: 'Fish Name',
    headerTitle: 'The name of the fish',
    sortable: true,
  },
  unique_name: {
    key: 'unique.name',
    label: 'Unique',
    headerTitle: 'You will always receive 1 of these per fish regardless of model when dismantling',
    sortable: true,
  },
  small: {
    key: 'small',
    label: 'Basic',
    headerTitle: 'Most common model of servofish',
    formatter: (value) => {
      return `${value.resources.scrap} Scrap & ${value.standing} Standing`;
    },
  },
  medium: {
    key: 'medium',
    label: 'Adorned',
    headerTitle: 'Slightly more uncommon model of servofish',
    formatter: (value) => {
      return `${value.resources.scrap} Scrap & ${value.standing} Standing`;
    },
  },
  large: {
    key: 'large',
    label: 'Magnificent',
    headerTitle: 'Rare and perfect model of servofish',
    formatter: (value) => {
      return `${value.resources.scrap} Scrap & ${value.standing} Standing`;
    },
  },
  location: {
    key: 'location',
    label: 'Location',
    headerTitle: 'Location of where to find the servofish',
    sortable: true,
  },
  time: {
    key: 'time',
    label: 'Temperature',
    headerTitle: 'Temperature of when you can find the servofish',
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

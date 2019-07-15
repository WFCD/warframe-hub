<template>
  <b-container fluid>
    <b-col md="12">
      <router-link to="/vallis/map">
        <b-button variant="info" class="btn-block mb-3">Orb Vallis Map</b-button>
      </router-link>

      <div class="row">
        <b-table striped hover :items="fish" :fields="fields" class="fish-info b-table">
          <template slot="more_info" slot-scope="row">
            <b-button size="sm" @click="row.toggleDetails" class="mr-2">
              {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
            </b-button>
          </template>
          <template slot="row-details" slot-scope="data">
            <b-card>
              <b-row>
                <b-col>
                  <b>{{ data.item.name }} Image:</b>
                  <br />
                  <FishImg
                    type="fish"
                    :item="data.item.thumb"
                    :name="data.item.name"
                    width="200"
                    v-if="data.item.thumb"
                  />
                  <span v-else>No image available</span>
                  <br />
                  <b-btn
                    :href="data.item.wiki"
                    target="_blank"
                    size="sm"
                    rel="noopener"
                    variant="link"
                    v-if="data.item.thumb"
                  >
                    {{ data.item.name }} - Wikia
                  </b-btn>
                </b-col>
                <b-col>
                  <b>{{ data.item.unique.name }} Image:</b>
                  <br />
                  <FishImg
                    type="parts"
                    :item="data.item.unique.thumb"
                    :name="data.item.unique.name"
                    width="200"
                    v-if="data.item.unique.thumb"
                  />
                  <span v-else>No image available</span>
                  <br />
                  <b-btn
                    :href="data.item.unique.wiki"
                    target="_blank"
                    size="sm"
                    rel="noopener"
                    variant="link"
                    v-if="data.item.unique.thumb"
                  >
                    {{ data.item.unique.name }} - Wikia
                  </b-btn>
                </b-col>
                <b-col>
                  <b>{{ data.item.bait.name }} Image:</b>
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
      </div>

      <router-link to="/vallis/fish/howto#hotspots">
        <b-button variant="info" class="btn-block mb-3">What is a Hotspot?</b-button>
      </router-link>
    </b-col>
  </b-container>
</template>

<script>
import fish from '@/assets/json/vallisfish.json';
import FishImg from '@/components/FishImg.vue';

const fields = [
  {
    key: 'name',
    label: 'Fish Name',
    headerTitle: 'The name of the fish',
    sortable: true,
  },
  {
    key: 'unique.name',
    label: 'Unique',
    headerTitle: 'You will always receive 1 of these per fish regardless of model when dismantling',
    sortable: true,
  },
  {
    key: 'small',
    label: 'Basic',
    headerTitle: 'Most common model of servofish',
    formatter: (value) => {
      return `${value.resources.scrap} Scrap & ${value.standing} Standing`;
    },
  },
  {
    key: 'medium',
    label: 'Adorned',
    headerTitle: 'Slightly more uncommon model of servofish',
    formatter: (value) => {
      return `${value.resources.scrap} Scrap & ${value.standing} Standing`;
    },
  },
  {
    key: 'large',
    label: 'Magnificent',
    headerTitle: 'Rare and perfect model of servofish',
    formatter: (value) => {
      return `${value.resources.scrap} Scrap & ${value.standing} Standing`;
    },
  },
  {
    key: 'location',
    label: 'Location',
    headerTitle: 'Location of where to find the servofish',
    sortable: true,
  },
  {
    key: 'time',
    label: 'Temperature',
    headerTitle: 'Temperature of when you can find the servofish',
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
    key: 'maximumPoint',
    label: 'Max Points',
    headerTitle: 'The maximum points possible for this fish',
    sortable: true,
  },
  'more_info',
];

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

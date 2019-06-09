<template>
  <b-container fluid>
    <b-col md="12">
      <router-link to="/poe/map">
        <b-btn variant="info" class="btn-block mb-3">Plains of Eidolon Map</b-btn>
      </router-link>

      <div class="row">
        <table class="table fish-info striped hover">
          <thead>
            <tr>
              <th title="The name of the fish">Fish Name</th>
              <th title="Number of fish parts you receive is dependent on fish size">
                Size
              </th>
              <th title="Number of fish meat you will receive when making bait">
                Meat
              </th>
              <th title="Number of fish scale you will receive when making bait">
                Scales
              </th>
              <th title="Number of fish oil you will receive when making bait">
                Oil
              </th>
              <th title="You will always receive 1 of these per fish when making bait">
                Unique
              </th>
              <th title="Ostron standing gain when donating fish">Standing</th>
              <th title="Location of where to find the fish">Location</th>
              <th title="Time of when you can find the fish">Time</th>
              <th title="How likely the fish will spawn">Rarity</th>
              <th title="The appropriate spear needed for this fish">Spear</th>
              <th title="The maximum weight possible for this fish">
                Max Weight
              </th>
            </tr>
          </thead>
          <tbody v-for="(fish, index) in this.fishes" :key="fish.name">
            <tr :class="'color' + ((index % 2) + 1)">
              <td rowspan="3">
                <b-btn :id="`${fish.name}_tooltip`" size="md" variant="link" class="m-3">
                  {{ fish.name }}
                </b-btn>
                <b-tooltip :target="`${fish.name}_tooltip`" placement="top">
                  <FishImg type="fish" :item="fish.thumb" :name="fish.name" width="200" v-if="fish.thumb" />
                  <span v-else> No image available</span>
                </b-tooltip>
              </td>
              <td v-if="fish.smallLabel">{{ fish.smallLabel }}</td>
              <td v-else>S</td>
              <td>{{ fish.small.resources.meat }}</td>
              <td>{{ fish.small.resources.scales }}</td>
              <td>{{ fish.small.resources.oil }}</td>
              <td rowspan="3">
                <b-btn :id="`${fish.unique.name}_unique_tooltip`" size="md" variant="link" class="m-3">
                  {{ fish.unique.name }}
                </b-btn>
                <b-tooltip :target="`${fish.unique.name}_unique_tooltip`" placement="top">
                  <FishImg
                    type="parts"
                    :item="fish.unique.thumb"
                    :name="fish.unique.name"
                    width="200"
                    v-if="fish.unique.thumb"
                  />
                  <span v-else> No image available</span>
                  <b-btn
                    :href="fish.unique.wiki"
                    target="_blank"
                    size="sm"
                    rel="noopener"
                    variant="link"
                    v-if="fish.unique.thumb"
                  >
                    Wikia Article
                  </b-btn>
                </b-tooltip>
              </td>
              <td>{{ fish.small.standing }}</td>
              <td rowspan="3">{{ fish.location }}</td>
              <td rowspan="3">{{ fish.time }}</td>
              <td rowspan="3">
                <span>{{ fish.rarity }}</span>

                <br v-if="fish.hotspot" />
                <span v-if="fish.hotspot">Hotspot Required</span>

                <br v-if="fish.bait" />
                <b-btn
                  v-if="fish.bait"
                  :id="`${fish.name}_${fish.bait.name}_bait_tooltip`"
                  size="md"
                  variant="link"
                  class="mb-1"
                >
                  {{ fish.bait.name }}
                </b-btn>
                <b-tooltip v-if="fish.bait" :target="`${fish.name}_${fish.bait.name}_bait_tooltip`" placement="top">
                  <FishImg
                    type="bait"
                    :item="fish.bait.thumb"
                    :name="fish.bait.name"
                    width="200"
                    v-if="fish.bait.thumb"
                  />
                  <span v-else> No image available</span>
                </b-tooltip>
              </td>
              <td rowspan="3">
                <span v-for="spear in fish.spear" :key="spear">{{ spear }} <br /></span>
              </td>
              <td rowspan="3">{{ fish.maximumMass }}</td>
            </tr>
            <tr :class="'color' + ((index % 2) + 1)" v-if="fish.medium">
              <td>M</td>
              <td>{{ fish.medium.resources.meat }}</td>
              <td>{{ fish.medium.resources.scales }}</td>
              <td>{{ fish.medium.resources.oil }}</td>
              <td>{{ fish.medium.standing }}</td>
            </tr>
            <tr :class="'color' + ((index % 2) + 1)" v-if="fish.large">
              <td>L</td>
              <td>{{ fish.large.resources.meat }}</td>
              <td>{{ fish.large.resources.scales }}</td>
              <td>{{ fish.large.resources.oil }}</td>
              <td>{{ fish.large.standing }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <router-link to="/poe/fish/howto#hotspots">
        <b-btn variant="info" class="btn-block">What is a Hotspot?</b-btn>
      </router-link>
    </b-col>
  </b-container>
</template>

<script>
import fish from '@/assets/json/fish.json';
import FishImg from '@/components/FishImg.vue';

export default {
  name: 'fish',
  components: {
    FishImg,
  },
  data() {
    return {
      fishes: fish,
    };
  },
};
</script>

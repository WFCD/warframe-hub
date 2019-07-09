<template>
  <b-container fluid>
    <b-col md="12">
      <router-link to="/vallis/map">
        <b-btn variant="info" class="btn-block mb-3">Orb Vallis Map</b-btn>
      </router-link>
      <p style="color:firebrick">
        <b>
          All servofish in the Orb Vallis should be acquired with a shock spear to avoid damage to them
        </b>
      </p>
      <div class="row">
        <table class="table fish-info striped hover">
          <thead>
            <tr>
              <th title="The name of the fish">Fish Name</th>
              <th title="Most common model of servofish">
                Basic
              </th>
              <th title="Slightly more uncommon model of servofish">
                Adorned
              </th>
              <th title="Perfect condition of servofish model">
                Magnificent
              </th>
              <th title="You will always receive 1 of these per fish regardless of model when dismantling">
                Unique
              </th>
              <th title="Location of where to find the servofish">Location</th>
              <th title="Cycle of when you can find the servofish">Time</th>
              <th title="How likely the fish will spawn">Rarity</th>
              <th title="What bait will make this servofish more likely to spawn">Bait</th>
              <th title="The maximum points possible for this fish">
                Max Points
              </th>
            </tr>
          </thead>
          <tbody v-for="(fish, index) in this.fishes" :key="fish.name">
            <tr :class="'color' + ((index % 2) + 1)">
              <td>
                <b-btn :id="`${fish.name}_tooltip`" size="md" variant="link">
                  {{ fish.name }}
                </b-btn>
                <b-tooltip :target="`${fish.name}_tooltip`" placement="top">
                  <FishImg type="fish" :item="fish.thumb" :name="fish.name" width="200" v-if="fish.thumb" />
                  <span v-else> No image available</span>
                </b-tooltip>
              </td>
              <td>{{ fish.small.resources.scrap }} Scrap + {{ fish.small.standing }} Standing</td>
              <td>{{ fish.medium.resources.scrap }} Scrap + {{ fish.medium.standing }} Standing</td>
              <td>{{ fish.large.resources.scrap }} Scrap + {{ fish.large.standing }} Standing</td>
              <td>
                <b-btn :id="`${fish.unique.name}_unique_tooltip`" size="md" variant="link">
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
              <td>{{ fish.location }}</td>
              <td>{{ fish.time }}</td>
              <td>
                <span>{{ fish.rarity }}</span>
                <br v-if="fish.hotspot" />
                <span v-if="fish.hotspot">Hotspot Required</span>
              </td>
              <td>
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
              <td>{{ fish.maximumPoint }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <router-link to="/vallis/fish/howto#hotspots">
        <b-btn variant="info" class="btn-block">What is a Hotspot?</b-btn>
      </router-link>
    </b-col>
  </b-container>
</template>

<script>
import fish from '@/assets/json/vallisfish.json';
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

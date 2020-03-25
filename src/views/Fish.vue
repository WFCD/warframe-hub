<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <router-link to="/poe/map">
          <b-button variant="info" class="mb-3 float-right">Plains of Eidolon Map</b-button>
        </router-link>
        <router-link to="/poe/fish/howto#hotspots">
          <b-button variant="info" class="mb-3 mr-3 float-right">What is a Hotspot?</b-button>
        </router-link>
      </b-col>
    </b-row>

    <b-row>
      <b-table
        striped
        responsive
        hover
        :items="fish"
        :fields="fields"
        class="fish-info b-table mx-3"
        primary-key="name"
        sticky-header="70vh"
      >
        <template v-slot:cell(small)="data">
          {{ data.item.small.resources.meat }}
          <FishImg type="common" item="meat" title="Fish Meat" width="20" />
          {{ data.item.small.resources.scales }}
          <FishImg type="common" item="scale" title="Fish Scales" width="20" />
          {{ data.item.small.resources.oil }}
          <FishImg type="common" item="oil" title="Fish Oil" width="20" />
          / {{ data.item.small.standing }}
          <FishImg type="common" item="standing" title="Ostron Standing" width="15" invert="true" />
        </template>
        <template v-slot:cell(medium)="data">
          {{ data.item.medium.resources.meat }}
          <FishImg type="common" item="meat" title="Fish Meat" width="20" />
          {{ data.item.medium.resources.scales }}
          <FishImg type="common" item="scale" title="Fish Scales" width="20" />
          {{ data.item.medium.resources.oil }}
          <FishImg type="common" item="oil" title="Fish Oil" width="20" />
          / {{ data.item.medium.standing }}
          <FishImg type="common" item="standing" title="Ostron Standing" width="15" invert="true" />
        </template>
        <template v-slot:cell(large)="data">
          {{ data.item.large.resources.meat }}
          <FishImg type="common" item="meat" title="Fish Meat" width="20" />
          {{ data.item.large.resources.scales }}
          <FishImg type="common" item="scale" title="Fish Scales" width="20" />
          {{ data.item.large.resources.oil }}
          <FishImg type="common" item="oil" title="Fish Oil" width="20" />
          / {{ data.item.large.standing }}
          <FishImg type="common" item="standing" title="Ostron Standing" width="15" invert="true" />
        </template>
        <template v-slot:cell(time.string)="data">
          <span v-bind:id="data.item.name + '-time'">
            <i v-if="data.item.time.night.appear" class="fas fa-lg fa-moon" style="color:skyblue" />
            <i v-if="data.item.time.night.prefer" class="fas fa-lg fa-arrow-left mx-1"></i>
            <i v-if="data.item.time.day.prefer" class="fas fa-lg fa-arrow-right mx-1"></i>
            <i v-if="data.item.time.day.appear" class="fas fa-lg fa-sun" style="color:darkorange" />
          </span>
          <b-tooltip v-bind:target="data.item.name + '-time'" :title="data.item.time.string" />
        </template>
        <template v-slot:cell(rarity)="data">
          <FishImg
            type="common"
            :item="data.item.rarity.slice(2).toLowerCase()"
            :name="data.item.rarity.slice(2)"
            :title="data.item.rarity.slice(2)"
            width="20"
          />
        </template>
        <template v-slot:cell(baitrequired)="data">
          <i v-if="data.item.bait.required" class="fas fa-lg fa-check-circle" style="color:lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color:salmon" />
        </template>
        <template v-slot:cell(hotspot)="data">
          <i v-if="data.item.hotspot" class="fas fa-lg fa-check-circle" style="color:lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color:salmon" />
        </template>
        <template v-slot:cell(spear)="data">
          <FishImg v-if="data.item.spear.lanzo" type="common" item="lanzosm" title="Lanzo (T1)" width="30" />
          <FishImg v-if="data.item.spear.tulok" type="common" item="tuloksm" title="Tulok (T2)" width="30" />
          <FishImg v-if="data.item.spear.peram" type="common" item="peramsm" title="Peram (T3)" width="30" />
        </template>
        <template v-slot:cell(moreinfo)="data">
          <b-button v-if="data.item.thumb" size="sm" @click="data.toggleDetails" class="mr-2">
            <i v-if="data.detailsShowing" class="fas fa-times-circle"></i>
            <i v-else class="fas fa-info-circle"></i>
          </b-button>
        </template>
        <template v-slot:row-details="data">
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
                <FishImg type="parts" :item="data.item.unique.thumb" :title="data.item.unique.name" width="150" />
              </b-col>
              <b-col v-if="data.item.bait.thumb">
                <b>{{ data.item.bait.name }}</b>
                <br />
                <FishImg type="bait" :item="data.item.bait.thumb" :title="data.item.bait.name" width="120" />
              </b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import fish from '@/assets/json/fish.json';
import FishImg from '@/components/FishImg.vue';

const fields = [
  {
    key: 'name',
    label: 'Name',
    headerTitle: 'The name of the fish',
    sortable: true,
  },
  {
    key: 'unique.name',
    label: 'Unique',
    headerTitle: 'Unique item when dismantling - you will receive one regardless of size',
    sortable: true,
  },
  {
    key: 'small',
    label: 'Small',
    headerTitle: 'Common size - you will get fish parts if dismantled or standing if donated',
  },
  {
    key: 'medium',
    label: 'Medium',
    headerTitle: 'Uncommon size - you will get fish parts if dismantled or standing if donated',
  },
  {
    key: 'large',
    label: 'Large',
    headerTitle: 'Rare size - you will get fish parts if dismantled or standing if donated',
  },
  {
    key: 'location',
    label: 'Location',
    headerTitle: 'Location of where to find the fish',
    sortable: true,
  },
  {
    key: 'time.string',
    label: 'Time',
    headerTitle: 'Time of when you can find the fish - arrow denotes preference',
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
    headerTitle: 'What bait will make this fish more likely to spawn',
    sortable: true,
  },
  {
    key: 'baitrequired',
    label: 'Bait Required',
    headerTitle: 'Whether bait is required in order for this fish to spawn',
    sortable: true,
  },
  {
    key: 'hotspot',
    label: 'Hotspot Required',
    headerTitle: 'Whether a hotspot is required for this fish to spawn',
    sortable: true,
  },
  {
    key: 'spear',
    label: 'Spear',
    headerTitle: 'What spear is effective at catching the fish',
  },
  {
    key: 'maximumMass',
    label: 'Max Weight',
    headerTitle: 'The maximum weight possible for this fish',
    sortable: true,
  },
  {
    key: 'moreinfo',
    label: 'Info',
    headerTitle: 'Display pictures for fish, unique, and bait type',
  },
];

export default {
  name: 'fish',
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
      this.$ga.page('/poe/fish');
    },
  },
};
</script>

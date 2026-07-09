<template>
  <b-container fluid>
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
        <template #cell(moreinfo)="row">
          <div size="sm" class="mr-2" @click="row.toggleDetails">
            <i v-if="row.detailsShowing" class="fas fa-chevron-down"></i>
            <i v-else class="fas fa-chevron-right"></i>
          </div>
        </template>
        <template #cell(small)="data">
          {{ data.item.small.resources.tumor }}
          <FishImg type="common" item="tumor" title="Benign Infested Tumor" width="20" />
          <span v-if="data.item.small.resources.bladder">
            {{ data.item.small.resources.bladder }}
            <FishImg type="common" item="bladder" title="Fermented Bladder" width="20" />
          </span>
          <span v-if="data.item.small.resources.gills">
            {{ data.item.small.resources.gills }}
            <FishImg type="common" item="gills" title="Tubercular Gill System" width="20" />
          </span>
        </template>
        <template #cell(medium)="data">
          {{ data.item.medium.resources.tumor }}
          <FishImg type="common" item="tumor" title="Benign Infested Tumor" width="20" />
          <span v-if="data.item.medium.resources.bladder">
            {{ data.item.medium.resources.bladder }}
            <FishImg type="common" item="bladder" title="Fermented Bladder" width="20" />
          </span>
          <span v-if="data.item.medium.resources.gills">
            {{ data.item.medium.resources.gills }}
            <FishImg type="common" item="gills" title="Tubercular Gill System" width="20" />
          </span>
        </template>
        <template #cell(large)="data">
          {{ data.item.large.resources.tumor }}
          <FishImg type="common" item="tumor" title="Benign Infested Tumor" width="20" />
          <span v-if="data.item.large.resources.bladder">
            {{ data.item.large.resources.bladder }}
            <FishImg type="common" item="bladder" title="Fermented Bladder" width="20" />
          </span>
          <span v-if="data.item.large.resources.gills">
            {{ data.item.large.resources.gills }}
            <FishImg type="common" item="gills" title="Tubercular Gill System" width="20" />
          </span>
        </template>
        <template #cell(time)="data">
          <span :id="data.item.name + '-time'">
            <FishImg v-if="data.item.time.vome.appear" type="time" item="vome" title="Vome" width="20" />
            <FishImg v-if="data.item.time.fass.appear" type="time" item="fass" title="Fass" width="20" />
          </span>
        </template>
        <template #cell(rarity)="data">
          <FishImg
            type="common"
            :item="data.item.rarity.slice(2).toLowerCase()"
            :name="data.item.rarity.slice(2)"
            :title="data.item.rarity.slice(2)"
            width="15"
          />
        </template>
        <template #cell(baitrequired)="data">
          <i v-if="data.item.bait.recommended" class="fas fa-lg fa-check-circle" style="color: lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color: salmon" />
        </template>
        <template #cell(hotspot)="data">
          <i v-if="data.item.hotspot" class="fas fa-lg fa-check-circle" style="color: lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color: salmon" />
        </template>
        <template #cell(spear)="data">
          <FishImg v-if="data.item.spear.spari" type="common" item="spari" title="Spari (T1)" width="30" />
          <FishImg v-if="data.item.spear.ebisu" type="common" item="ebisu" title="Ebisu (T2)" width="30" />
        </template>
        <template #cell(unique)="data">
          <span v-for="name in data.item.unique.map((n) => n.name)" :key="name">
            {{ name }}
            <br />
          </span>
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
              <b-col v-for="unique in data.item.unique" :key="unique.name">
                <b-btn :href="unique.wiki" target="_blank" size="sm" rel="noopener" variant="link">
                  {{ unique.name }}
                </b-btn>
                <br />
                <FishImg type="parts" :item="unique.thumb" :title="unique.name" width="150" />
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
import fish from '@/static/json/fish/deimos.json';
import FishImg from '@/components/FishImg.jsx';

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
    key: 'unique',
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
    key: 'time',
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
    label: 'Bait Recommended',
    headerTitle: 'Whether bait is required in order for this fish to spawn',
    sortable: true,
  },
  {
    key: 'hotspot',
    label: 'Hotspot',
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
];

export default {
  name: 'DeimosFishView',
  components: {
    FishImg,
  },
  data() {
    return {
      fish,
      fields,
    };
  },
};
</script>

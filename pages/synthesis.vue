<template>
  <b-container fluid>
    <b-alert v-if="loading" show variant="info">
      <h4 class="alert-heading">Loading Synthesis Data...</h4>
      <hr />
      <p class="mb-0">If this card stays active for more than a minute, please reload the site or try agin later.</p>
    </b-alert>
    <b-row>
      <b-col md="3" sm="0" />
      <b-col md="6" sm="9">
        <b-form-group class="mb-0">
          <b-input-group size="md">
            <b-form-input id="filterInput" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="3" sm="3">
        <b-button
          href="https://warframe.fandom.com/wiki/Synthesis"
          target="_blank"
          variant="info"
          class="mb-3 mr-3 float-right"
        >
          What is Synthesis? <i class="fas fa-external-link-alt fa-xs"></i>
        </b-button>
      </b-col>
    </b-row>

    <b-row>
      <b class="mx-auto">
        <b-link href="https://steamcommunity.com/sharedfiles/filedetails/?id=666483447" target="_blank">
          Synthesis Data provided by Evilflora
        </b-link>
      </b>
    </b-row>
    <b-row>
      <b-pagination
        v-model="currentPage"
        class="mx-auto"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="synth-table"
        limit="7"
        :hide-ellipsis="true"
      ></b-pagination>
      <b-table
        id="synth-table"
        responsive
        hover
        striped
        :items="data"
        :fields="fields"
        class="b-table synth-table"
        :filter="filter"
        primary-key="name"
        sticky-header="70vh"
        :current-page="currentPage"
        :per-page="perPage"
        @filtered="onFiltered"
      >
        <template #cell(name)="datum">
          {{ datum.item.name }}
        </template>
        <template #cell(portrait)="datum">
          <SynthesisImg :name="datum.item.name" :image="datum.item.imageKey" />
        </template>
        <template #cell(location)="datum">
          <span v-for="(location, key) in datum.item.locations" :key="key">
            {{ location.planet }} ({{ location.mission }})
            <br v-if="key + 1 !== datum.item.locations.length" />
          </span>
        </template>
        <template #cell(level)="datum">
          <span v-for="(location, key) in datum.item.locations" :key="key">
            {{ location.level }}
            <br v-if="key + 1 !== datum.item.locations.length" />
          </span>
        </template>
        <template #cell(mission)="datum">
          <span v-for="(location, key) in datum.item.locations" :key="key">
            {{ location.faction }} - {{ location.type }}
            <br v-if="key + 1 !== datum.item.locations.length" />
          </span>
        </template>
        <template #cell(spawn_rate)="datum">
          <span v-for="(location, key) in datum.item.locations" :key="key">
            {{ location.spawn_rate }}
            <br v-if="key + 1 !== datum.item.locations.length" />
          </span>
        </template>
        <template #cell(verify)="datum">
          <span v-for="(location, key) in datum.item.locations" :key="key">
            {{ location.last_verified }}
            <br v-if="key + 1 !== datum.item.locations.length" />
          </span>
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
import SynthesisImg from '@/components/SynthesisImg.vue';

const fields = [
  {
    key: 'name',
    label: 'Name',
    headerTitle: 'The name of the Synthesis Target',
    sortable: true,
  },
  {
    key: 'portrait',
    label: 'Portrait',
    headerTitle: 'The portrait of the Synthesis Target',
    tdClass: 'synth-cell',
  },
  {
    key: 'location',
    label: 'Location',
    headerTitle: 'The location where you can find this Synthesis Target',
  },
  {
    key: 'level',
    label: 'Level',
    headerTitle: 'The level of the location where you can find this Synthesis Target',
  },
  {
    key: 'mission',
    label: 'Mission',
    headerTitle: 'The type of mission for the location where you can find this Synthesis Target',
  },
  {
    key: 'spawn_rate',
    label: 'Spawn Rate',
    headerTitle: 'Chance of the Synthesis Target spawning at this location',
  },
  {
    key: 'verify',
    label: 'Verify',
    headerTitle: 'Last verification date',
  },
];

export default {
  name: 'SynthesisView',
  components: {
    SynthesisImg,
  },
  data() {
    return {
      fields,
      data: [],
      loading: true,
      filter: null,
      currentPage: 1,
      perPage: 7,
      totalRows: 0,
    };
  },
  computed: {
    ...mapGetters('cache', ['synthData']),
  },
  watch: {
    synthData(val) {
      this.data = val;
      this.loading = false;
      this.totalRows = this.data.length;
    },
  },
  mounted() {
    if (this.synthData) {
      this.data = this.synthData;
      this.totalRows = this.data.length;
    } else {
      this.data = [];
      this.loading = true;
      this.$store.dispatch('cache/updateSynthData');
    }
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

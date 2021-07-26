<template>
  <b-container fluid>
    <b-alert v-if="loading" show variant="info">
      <h4 class="alert-heading">Loading Riven Data for {{ platforms[platform].display }}</h4>
      <hr />
      <p class="mb-0">If this card stays active for more than a minute, please reload the site or try agin later.</p>
    </b-alert>
    <b-row>
      <b-col md="3" offset-md="0" offset-sm="3" sm="6">
        <b-dropdown id="typeDropdown" text="Select Riven Types">
          <b-form-group>
            <b-form-checkbox-group v-model="selectedTypes" :options="types" name="type-option" />
          </b-form-group>
        </b-dropdown>
      </b-col>
      <b-col md="6" sm="12">
        <b-form-group class="mb-0">
          <b-input-group size="md">
            <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Type to Search"></b-form-input>
            <b-input-group-append>
              <b-button
                :disabled="!filter"
                @click="
                  filter = '';
                  rollstate = 'both';
                  selectedTypes = [];
                "
              >
                Clear
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="3" offset-md="0" offset-sm="3" sm="6">
        <b-form-group label="Filter by rolled:" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            :aria-describedby="ariaDescribedby"
            v-model="rollstate"
            :options="rolls"
            name="roll-option"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b class="mx-auto">
        <b-link href="https://forums.warframe.com/topic/1077490-r" target="_blank"> DE's Riven Data </b-link>
      </b>
    </b-row>
    <b-row>
      <b-pagination
        class="mx-auto"
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="riven-table"
        limit="7"
        :hide-ellipsis="true"
      ></b-pagination>
      <b-table
        id="riven-table"
        small
        responsive
        hover
        striped
        :items="data"
        :fields="fields"
        class="b-table synth-table"
        :filter="filter"
        :filter-function="filterBy"
        sticky-header="70vh"
        :current-page="currentPage"
        :per-page="perPage"
        @filtered="onFiltered"
      >
        <template v-slot:cell(compatibility)="data">
          {{ toTitleCase(data.item.compatibility || 'Veiled') }}
        </template>
        <template v-slot:cell(rerolled)="data">
          <i v-if="data.item.rerolled" class="fas fa-lg fa-check-circle" style="color: lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color: salmon" />
        </template>
        <template v-slot:cell(avg)="data">
          {{ String(data.item.avg) }}
        </template>
        <template v-slot:cell(stddev)="data">
          {{ String(data.item.stddev) }}
        </template>
        <template v-slot:cell(min)="data">
          {{ String(data.item.min) }}
        </template>
        <template v-slot:cell(median)="data">
          {{ String(data.item.median) }}
        </template>
        <template v-slot:cell(max)="data">
          {{ String(data.item.max) }}
        </template>
        <template v-slot:cell(pop)="data">
          {{ String(data.item.pop) }}
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
import platforms from '@/assets/json/platforms.json';

const fields = [
  {
    key: 'compatibility',
    label: 'Weapon',
    headerTitle: 'Compatible Weapon',
    sortable: true,
  },
  {
    key: 'rerolled',
    label: 'Rerolled?',
    headerTitle: 'Whether or not this denotes a riven that has been rerolled',
    sortable: true,
  },
  {
    key: 'avg',
    label: 'Average Trade',
    headerTitle: 'Average cost of the platinum when trading it',
    sortable: true,
  },
  {
    key: 'stddev',
    label: 'Standard Deviation',
    headerTitle: 'Standard Deviation',
    sortable: true,
  },
  {
    key: 'min',
    label: 'Min Traded Value',
    headerTitle: 'Minimum value at which the riven was traded',
    sortable: true,
  },
  {
    key: 'median',
    label: 'Median',
    headerTitle: 'Median Value of traded Riven',
    sortable: true,
  },
  {
    key: 'max',
    label: 'Max Traded Value',
    headerTitle: 'Maximuim value at which the riven was traded',
    sortable: true,
  },
  {
    key: 'pop',
    label: 'Population',
    headerTitle: 'Number of rivens traded for determining stats',
    sortable: true,
  },
];
const rolls = [
  { text: 'Rolled', value: 'rolled' },
  { text: 'Unrolled', value: 'unrolled' },
  { text: 'Both', value: 'both', default: true },
];

export default {
  name: 'rivendata',
  data() {
    return {
      data: [],
      platforms: platforms,
      fields: fields,
      filter: null,
      loading: false,
      rollstate: 'both',
      rolls: rolls,
      types: [],
      selectedTypes: [],
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
    };
  },
  watch: {
    rivens: function (val) {
      this.loading = true;
      this.data = val;
      this.loading = false;
      this.totalRows = val.length;
    },
  },
  computed: {
    ...mapGetters({
      rivens: 'rivens',
      platform: 'platform',
    }),
  },
  methods: {
    filterBy: function (row, filter) {
      const rollFilter =
        this.rollstate === 'both' ||
        (this.rollstate === 'rolled' && row.rerolled) ||
        (this.rollstate === 'unrolled' && !row.rerolled);
      const noFilter = !filter && row.item && !row.compatibility;
      const compatMatches =
        filter && row.compatibility && row.compatibility.toLowerCase().includes(filter.toLowerCase());
      const typeMatches = !this.selectedTypes.length || this.selectedTypes.includes(row.itemType);
      return rollFilter && (noFilter || (compatMatches && typeMatches));
    },
    toTitleCase: function (str) {
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
    onFiltered: function (filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  mounted() {
    if (this.rivens) {
      this.data = this.rivens;
      this.types = Array.from(new Set(this.rivens.map((r) => r.itemType)));
      this.totalRows = this.rivens.length;
    } else {
      this.data = [];
      this.loading = true;
      this.$store.dispatch('updateRivens');
    }
  },
};
</script>

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
            <b-form-input id="filterInput" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>
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
        <b-form-group v-slot="{ ariaDescribedby }" label="Filter by rolled:">
          <b-form-radio-group
            v-model="rollstate"
            :aria-describedby="ariaDescribedby"
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
        v-model="currentPage"
        class="mx-auto"
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
        <template #cell(compatibility)="datum">
          {{ toTitleCase(datum.item.compatibility || 'Veiled') }}
        </template>
        <template #cell(rerolled)="datum">
          <i v-if="datum.item.rerolled" class="fas fa-lg fa-check-circle" style="color: lightgreen" />
          <i v-else class="fas fa-lg fa-times-circle" style="color: salmon" />
        </template>
        <template #cell(avg)="datum">
          {{ String(datum.item.avg) }}
        </template>
        <template #cell(stddev)="datum">
          {{ String(datum.item.stddev) }}
        </template>
        <template #cell(min)="datum">
          {{ String(datum.item.min) }}
        </template>
        <template #cell(median)="datum">
          {{ String(datum.item.median) }}
        </template>
        <template #cell(max)="datum">
          {{ String(datum.item.max) }}
        </template>
        <template #cell(pop)="datum">
          {{ String(datum.item.pop) }}
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
import platforms from '@/static/json/platforms.json';

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
  name: 'RivenDataView',
  data() {
    return {
      data: [],
      platforms,
      fields,
      filter: null,
      loading: false,
      rollstate: 'both',
      rolls,
      types: [],
      selectedTypes: [],
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
    };
  },
  computed: {
    ...mapGetters({
      rivensCache: 'cache/rivens',
      platform: 'worldstate/platform',
    }),
    rivens: {
      get() {
        return this.rivensCache?.[this.platform] || [];
      },
    },
  },
  watch: {
    rivens(val) {
      this.loading = true;
      this.data = val;
      this.loading = false;
      this.totalRows = val.length;
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.rivens) {
        this.data = this.rivens;
        this.types = Array.from(new Set(this.rivens.map((r) => r.itemType)));
        this.totalRows = this.rivens.length;
      } else {
        this.data = [];
        this.loading = true;
        this.$store.dispatch('cache/updateRivens');
      }
    });
  },
  methods: {
    filterBy(row, filter) {
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
    toTitleCase(str) {
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

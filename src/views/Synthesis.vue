<template>
  <b-container fluid>
    <b-alert v-if="loading" show variant="info">
      <h4 class="alert-heading">Loading Synthesis Data...</h4>
      <hr />
      <p class="mb-0">
        If this card stays active for more than a minute, please reload the site or try agin later.
      </p>
    </b-alert>
    <b-row>
      <b-col md="3" sm="0" />
      <b-col md="6" sm="9">
        <b-form-group class="mb-0">
          <b-input-group size="md">
            <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Type to Search"></b-form-input>
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
          What is Synthesis?
        </b-button>
      </b-col>
    </b-row>

    <b-row>
      <b class="mx-auto">
        <b-link href="https://steamcommunity.com/sharedfiles/filedetails/?id=666483447" target="_blank">
          Synthesis Data provided by Evilflora
        </b-link>
      </b>
      <b-table
        responsive
        hover
        striped
        :items="synthdata"
        :fields="fields"
        class="b-table synth-table"
        :filter="filter"
        primary-key="name"
      >
        <template slot="name" slot-scope="data">
          {{ data.item.name }}
        </template>
        <template slot="portrait" slot-scope="data">
          <SynthesisImg :name="data.item.name" />
        </template>
        <template slot="location" slot-scope="data">
          <span v-for="(location, key) in data.item.locations" :key="key">
            {{ location.planet }} ({{ location.mission }})
            <br v-if="key + 1 != data.item.locations.length" />
          </span>
        </template>
        <template slot="level" slot-scope="data">
          <span v-for="(location, key) in data.item.locations" :key="key">
            {{ location.level }}
            <br v-if="key + 1 != data.item.locations.length" />
          </span>
        </template>
        <template slot="mission" slot-scope="data">
          <span v-for="(location, key) in data.item.locations" :key="key">
            {{ location.faction }} - {{ location.type }}
            <br v-if="key + 1 != data.item.locations.length" />
          </span>
        </template>
        <template slot="spawn_rate" slot-scope="data">
          <span v-for="(location, key) in data.item.locations" :key="key">
            {{ location.spawn_rate }}
            <br v-if="key + 1 != data.item.locations.length" />
          </span>
        </template>
        <template slot="verify" slot-scope="data">
          <span v-for="(location, key) in data.item.locations" :key="key">
            {{ location.last_verified }}
            <br v-if="key + 1 != data.item.locations.length" />
          </span>
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import fetch from 'node-fetch';
import SynthesisImg from '@/components/SynthesisImg.vue';

const fields = {
  name: {
    label: 'Name',
    headerTitle: 'The name of the Synthesis Target',
    sortable: true,
  },
  portrait: {
    label: 'Portrait',
    headerTitle: 'The portrait of the Synthesis Target',
    tdClass: 'synth-cell',
  },
  location: {
    label: 'Location',
    headerTitle: 'The location where you can find this Synthesis Target',
  },
  level: {
    label: 'Level',
    headerTitle: 'The level of the location where you can find this Synthesis Target',
  },
  mission: {
    label: 'Mission',
    headerTitle: 'The type of mission for the location where you can find this Synthesis Target',
  },
  spawn_rate: {
    label: 'Spawn Rate',
    headerTitle: 'Chance of the Synthesis Target spawning at this location',
  },
  verify: {
    label: 'Verify',
    headerTitle: 'Last verification date',
  },
};

export default {
  name: 'synthesis',
  components: {
    SynthesisImg,
  },
  data() {
    return {
      fields: fields,
      synthdata: [],
      loading: true,
      filter: null,
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    track() {
      this.$ga.page('/synthesis');
    },
    async getdata() {
      const res = JSON.parse(await fetch('https://api.warframestat.us/synthTargets').then((res) => res.text()));
      this.synthdata = res;
      this.loading = false;
    },
  },
};
</script>

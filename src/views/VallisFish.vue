<template>
<b-container fluid>
  <b-col md="12">

    <router-link to="/vallis/map">
      <b-button variant="info" class="btn-block mb-3">Orb Vallis Map</b-button>
    </router-link>

    <div class="row">
      <b-table striped hover :items="items" class="fish-info b-table"></b-table>
    </div>
  </b-col>
</b-container>
</template>

<script>
  const items = [{
      species: 'Sapcaddy',
      location: 'Lake',
      time: 'Cold',
      hotspot: 'No',
      resource: 'Venedo Case',
      basic: '3 Scrap/35 Standing',
      adorned: '4 Scrap/45 Standing',
      magnificent: '5 Scrap/70 Standing'
    },
    {
      species: 'Echowinder',
      location: 'Lake',
      time: 'Warm',
      hotspot: 'No',
      resource: 'Anoscopic Sensor',
      basic: '2 Scrap/35 Standing',
      adorned: '3 Scrap/45 Standing',
      magnificent: '4 Scrap/70 Standing'
    },
    {
      species: 'Kriller',
      location: 'Lake',
      time: 'Warm',
      hotspot: 'Yes',
      resource: 'Thermal Laser',
      basic: '1 Scrap/45 Standing',
      adorned: '2 Scrap/60 Standing',
      magnificent: '3 Scrap/100 Standing'
    },
    {
      species: 'Longwinder',
      location: 'Lake',
      time: 'Warm',
      hotspot: 'No',
      resource: 'Lathe Coagulant',
      basic: '2 Scrap/200 Standing',
      adorned: '3 Scrap/300 Standing',
      magnificent: '4 Scrap/500 Standing'
    },
    {
      species: 'Brickie',
      location: 'Pond',
      time: 'Warm',
      hotspot: 'No',
      resource: 'Muon Battery',
      basic: '2 Scrap/35 Standing',
      adorned: '3 Scrap/45 Standing',
      magnificent: '4 Scrap/70 Standing'
    },
    {
      species: 'Tink',
      location: 'Pond',
      time: 'Cold',
      hotspot: 'No',
      resource: 'Dissipator Coil',
      basic: '1 Scrap/35 Standing',
      adorned: '2 Scrap/45 Standing',
      magnificent: '3 Scrap/70 Standing'
    },
    {
      species: 'Eye-Eye',
      location: 'Pond',
      time: 'Warm',
      hotspot: 'No',
      resource: 'Rotoblade',
      basic: '3 Scrap/45 Standing',
      adorned: '4 Scrap/60 Standing',
      magnificent: '5 Scrap/100 Standing'
    },
    {
      species: 'Recaster',
      location: 'Pond',
      time: 'Cold',
      hotspot: 'Yes',
      resource: 'Neural Relay',
      basic: '3 Scrap/45 Standing',
      adorned: '5 Scrap/60 Standing',
      magnificent: '7 Scrap/100 Standing'
    },
    {
      species: 'Tromyzon',
      location: 'Pond',
      time: 'Cold',
      hotspot: 'Yes',
      resource: 'Entroplasma',
      basic: '3 Scrap/200 Standing',
      adorned: '4 Scrap/300 Standing',
      magnificent: '5 Scrap/500 Standing'
    },
    {
      species: 'Scrubber',
      location: 'Cave',
      time: 'N/A',
      hotspot: 'No',
      resource: 'Exa Brain',
      basic: '1 Scrap/35 Standing',
      adorned: '2 Scrap/45 Standing',
      magnificent: '3 Scrap/70 Standing'
    },
    {
      species: 'Mirewinder',
      location: 'Cave',
      time: 'N/A',
      hotspot: 'No',
      resource: 'Parallel Biode',
      basic: '4 Scrap/45 Standing',
      adorned: '5 Scrap/60 Standing',
      magnificent: '6 Scrap/100 Standing'
    },
    {
      species: 'Charamote',
      location: 'Cave',
      time: 'N/A',
      hotspot: 'Yes',
      resource: 'Sagan Module',
      basic: '1 Scrap/200 Standing',
      adorned: '3 Scrap/300 Standing',
      magnificent: '5 Scrap/500 Standing'
    },
    {
      species: 'Synathid',
      location: 'Cave',
      time: 'N/A',
      hotspot: 'Yes',
      resource: 'Ecosynth Analyzer',
      basic: '4 Scrap/600 Standing',
      adorned: '6 Scrap/800 Standing',
      magnificent: '8 Scrap/1000 Standing'
    },
    {
      species: 'Crewman Boot',
      location: 'Any',
      time: 'Any',
      hotspot: 'No',
      resource: '400 Credits',
      basic: 'u',
      adorned: 'wot',
      magnificent: 'm8?'
    },
  ];

  export default {
    name: 'vallisfish',
    data() {
      return {
        items: items,
      };
    },
    methods: {
      track () {
        this.$ga.page('/vallis/fish');
      }
    }
  };
</script>

<template>
  <b-container fluid>
    <b-col md="12">
      <b-row>
        <div role="tablist" style="width: 100%;">
          <b-card no-body>
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle.fishmap-accordion variant="info">Fishing Map</b-btn>
            </b-card-header>
            <b-collapse id="fishmap-accordion" accordion="fishmap-accordion" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                  <FishImg type="misc" item="map" name="Map" height="100%" width="100%" />
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </b-row>

      <div class="row">
        <table class="table fish-info">
          <thead>
            <tr>
              <th title="The name of the fish">Fish Name</th>
              <th title="Number of fish parts you receive is dependent on fish size">Size</th>
              <th title="Number of fish meat you will receive when making bait">Meat</th>
              <th title="Number of fish scale you will receive when making bait">Scales</th>
              <th title="Number of fish oil you will receive when making bait">Oil</th>
              <th title="You will always receive 1 of these per fish when making bait">Unique</th>
              <th title="Ostron standing gain when donating fish">Standing</th>
              <th title="Location of where to find the fish">Location</th>
              <th title="Time of when you can find the fish">Time</th>
              <th title="How likely the fish will spawn">Rarity</th>
              <th title="The appropriate spear needed for this fish">Spear</th>
              <th title="The maximum weight possible for this fish">Max Weight</th>
            </tr>
          </thead>
          <tbody v-for="fish in this.fishes" :key="fish.name">
            <tr class="color1">
              <td rowspan="3">
                <a name="Fish tooltip" class="fish-tooltip" href="#/" v-if="fish.thumb">
                  <i class="far fa-image"></i> {{fish.name}}
                    <div class="fish-tooltip-inner">
                      <FishImg type="fish" :item="fish.thumb" :name="fish.name" height="100%" width="100%" />
                    </div>
                </a>
                <span v-else> {{fish.name}}</span>
              </td>
              <td v-if="fish.smallLabel">{{fish.smallLabel}}</td>
              <td v-else>S</td>
              <td>{{fish.small.resources.meat}}</td>
              <td>{{fish.small.resources.scales}}</td>
              <td>{{fish.small.resources.oil}}</td>
              <td rowspan="3">
                <a v-if="fish.unique.thumb" name="Wikia Article" rel="noopener" class="fish-tooltip" :href="fish.unique.wiki" target="_blank">
                  <i class="far fa-image"></i> {{fish.unique.name}}
                  <div class="fish-tooltip-inner">
                    <FishImg type="parts" :item="fish.unique.thumb" :name="fish.unique.name" height="100%" width="100%" />
                  </div>
                </a>
                <span v-else> {{fish.unique.name}}</span>
              </td>
              <td>{{fish.small.standing}}</td>
              <td rowspan="3">{{fish.location}}</td>
              <td rowspan="3">{{fish.time}}</td>
              <td rowspan="3">
                {{fish.rarity}}
                <br v-if="fish.hotspot" />
                <a v-if="fish.hotspot" name="Fish tooltip" class="fish-tooltip" href="#/">(<i class="far fa-image"></i>Hotspots)
                  <div class="fish-tooltip-inner">
                    <FishImg type="misc" item="hotspot" name="Hotspot" height="100%" width="100%" />
                  </div>
                </a>
                <br v-if="fish.bait" />
                <a v-if="fish.bait" name="Fish tooltip" class="fish-tooltip" href="#/"><i class="far fa-image"></i> {{fish.bait.name}}
                  <div class="fish-tooltip-inner">
                    <FishImg type="bait" :item="fish.bait.thumb" :name="fish.bait.name" height="100%" width="100%" />
                  </div>
                </a>
              </td>
              <td rowspan="3">
                <span v-for="spear in fish.spear" :key="spear">{{spear}} <br /></span>
              </td>
              <td rowspan="3">{{fish.maximumMass}}</td>
            </tr>
            <tr class="color1" v-if="fish.medium">
              <td>M</td>
              <td>{{fish.medium.resources.meat}}</td>
              <td>{{fish.medium.resources.scales}}</td>
              <td>{{fish.medium.resources.oil}}</td>
              <td>{{fish.medium.standing}}</td>
            </tr>
            <tr class="color1" v-if="fish.large">
              <td>L</td>
              <td>{{fish.large.resources.meat}}</td>
              <td>{{fish.large.resources.scales}}</td>
              <td>{{fish.large.resources.oil}}</td>
              <td>{{fish.large.standing}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-col>
  </b-container>
</template>

<style>
.fish-tooltip {
  text-decoration: none !important;
}

.fish-tooltip div {
  display: none;
  margin-left: 8px;
}

.fish-tooltip-inner img {
  object-fit: contain;
  max-width: 200px;
  max-height: 125px;
  background-color:#23272A!important;
}

.fish-tooltip:hover div {
  display: inline;
  margin-top: -55px;
  position: absolute;
  border: 2px solid;
}

/* Table styles */
.fish-info, .fish-info>tbody>tr>td {
  border: 2px solid #737373;
}

.table>thead>tr>th {
  border-bottom: 2px solid #737373;
}

.fish-info.table td, .fish-info.table th {
  vertical-align: middle;
}

.table td {
  padding: 0!important;
}

.table th {
  padding: 0.75rem 0;
}

.color1 > td {
  background-color: #363540;
}
</style>

<script>
  import fish from '@/assets/json/fish.json';
  import FishImg from '@/components/FishImg.vue';

  export default {
    name: 'fish',
    components: {
      FishImg
    },
    data() {
      return {
        fishes: fish,
        fullWidth: {
          width: '100%'
        }
      }
    }
  }
</script>

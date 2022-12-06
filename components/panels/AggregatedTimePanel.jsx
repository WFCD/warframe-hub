import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { mapState } from 'vuex';
import TimeBadge from '@/components/TimeBadge.jsx';

import HubPanelWrap from '@/components/HubPanelWrap.jsx';
import HubImg from '@/components/HubImg.jsx';

import { cdn, wfcdn, optimize } from '@/services/utilities.js';

dayjs.extend(utc);

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');
const steelPath = cdn('svg/sp-logo.svg');
const steelEssence = optimize(wfcdn('steel-essence.png'), '250x250', 'fill', 'center');

const fImg = {
  corpus,
  grineer,
  infested,
  infestation: infested,
  corrupted,
  orokin: corrupted,
  sentient,
};

const cycleDefault = {
  activation: '0',
  expiry: '0',
  isWarm: true,
  active: 'Fass',
  isDay: true,
};

const textStyle = {
  'text-transform': 'capitalize',
};

const EarthTimer = {
  props: ['earthCycle'],
  computed: {
    isEarthDay() {
      return this.$props.earthCycle.isDay;
    },
    isEarthNight() {
      return !this.$props.earthCycle.isDay;
    },
    now() {
      return dayjs().toISOString();
    },
  },
  render() {
    return (
      <div class="col-sm-3 my-3">
        <span style={textStyle}>
          {this.$t(`location.earth`)}
          <br />
          {this.isEarthDay && <i class="fa fa-sun fa-2x day" style={textStyle}></i>}
          {this.isEarthNight && <i class="fa fa-moon fa-2x night" style={textStyle}></i>}
          <br />
          {this.$t(`time.${this.earthCycle.state.toLowerCase()}`)}
        </span>
        <br />
        <TimeBadge
          starttime={this.earthCycle.activation || this.now}
          endtime={this.earthCycle.expiry}
          interval={1000}
          pullright={false}
        />
      </div>
    );
  },
};
const CetusTimer = {
  props: ['cetusCycle'],
  computed: {
    isCetusDay() {
      return this.cetusCycle.isDay;
    },
    isCetusNight() {
      return !this.cetusCycle.isDay;
    },
    now() {
      return dayjs().toISOString();
    },
  },
  render() {
    return (
      <div class="col-sm-3 my-3">
        <span style={textStyle}>
          {this.$t(`location.cetus`)}
          <br />
          {this.isCetusDay && <i class="fa fa-sun fa-2x day" style={textStyle}></i>}
          {this.isCetusNight && <i class="fa fa-moon fa-2x night" style={textStyle}></i>}
          <br />
          {this.$t(`time.${this.cetusCycle.state.toLowerCase()}`)}
        </span>
        <br />
        <TimeBadge
          starttime={this.cetusCycle.activation || this.now}
          endtime={this.cetusCycle.expiry}
          interval={1000}
          pullright={false}
        />
      </div>
    );
  },
};
const VallisTimer = {
  props: ['vallisCycle'],
  computed: {
    isVallisWarm() {
      return this.vallisCycle.isWarm;
    },
    isVallisCold() {
      return !this.vallisCycle.isWarm;
    },
    now() {
      return dayjs().toISOString();
    },
  },
  render() {
    return (
      <div class="col-sm-3 my-3">
        <span style={textStyle}>
          {this.$t(`location.vallis`)}
          <br />
          {this.isVallisWarm && <i class="fa fa-fire fa-2x warm" style={textStyle}></i>}
          {this.isVallisCold && <i class="fa fa-snowflake fa-2x cold" style={textStyle}></i>}

          <br />
          {this.$t(`time.${this.vallisCycle.state.toLowerCase()}`)}
        </span>
        <br />
        <TimeBadge
          starttime={this.vallisCycle.activation || this.now}
          endtime={this.vallisCycle.expiry}
          interval={1000}
          pullright={false}
        />
      </div>
    );
  },
};
const CambionTimer = {
  props: ['cambionCycle'],
  computed: {
    isCambionFass() {
      return this.cambionCycle.active === 'fass';
    },
    isCambionVome() {
      return this.cambionCycle.active === 'vome';
    },
  },
  render() {
    return (
      <div class="col-sm-3 my-3">
        <span style={textStyle}>
          {this.$t(`location.cambion`)}
          <br />
          {this.isCambionFass && <i class="fa fa-sun fa-2x day" style={textStyle}></i>}
          {this.isCambionVome && <i class="fa fa-moon fa-2x night" style={textStyle}></i>}
          <br />
          {this.$t(`time.${this.cambionCycle.active.toLowerCase()}`)}
        </span>
        <br />
        <TimeBadge
          starttime={this.cambionCycle.activation || this.now}
          endtime={this.cambionCycle.expiry}
          interval={1000}
          pullright={false}
        />
      </div>
    );
  },
};
const ResetTimer = {
  computed: {
    now() {
      return dayjs().toISOString();
    },
    nextDay() {
      return dayjs.utc().endOf('day').add(1, 'seconds').toISOString();
    },
  },
  render() {
    return (
      <div class="col-sm-3 my-3">
        <b-tooltip placement="auto" class="text-center" target="daily-reset">
          {this.$t('reset.tooltip')}
        </b-tooltip>
        <span style={textStyle}>{this.$t('reset.header')}</span>
        <i class="fas fa-info-circle fa-sm pl-1" id="daily-reset" style={textStyle} />
        <br />
        <TimeBadge starttime={this.now} endtime={this.nextDay} interval={1000} pullright={false} />
      </div>
    );
  },
};
const AnomalyTimer = {
  props: ['sentientOutposts'],
  computed: {},
  render() {
    return (
      <div class="col-sm-3 my-3 text-center">
        <span style={textStyle}>{this.$t('sentientoutpost.header')}</span>
        <HubImg
          id="para_tooltip"
          src={sentient}
          name={this.$t('factions.sentient') + ' | ' + this.$t('sentientoutpost.warn')}
          width="20px"
          height="20px"
          class="invert pl-1"
        />
        <br />
        <b>{this.sentientOutposts.mission.node}</b>
        <br />
        {this.sentientOutposts.mission.type}
      </div>
    );
  },
};
const SteelPathTimer = {
  props: ['steelPath'],
  render() {
    return (
      <div class="col-sm-3 my-3">
        <span style={textStyle}>{this.$t('steelPath.header')}</span>
        <HubImg
          src={steelPath}
          name={this.$t('steelPath.header')}
          class="li-mission-decorator li-mission-decorator-lg invert mx-1"
          height="20px"
          width="20px"
        />
        <br />
        <span style="font-size: 0.85em">
          <b>{this.steelPath?.currentReward?.name}</b>
        </span>
        <br />
        {this.steelPath?.currentReward?.cost}
        <HubImg src={steelEssence} name={this.$t('currency.steelEssense')} />
        <TimeBadge
          starttime={this.steelPath?.activation || '0'}
          endtime={this.steelPath?.expiry || '0'}
          interval={1000}
          pullright={false}
        />
      </div>
    );
  },
};
const ArbitrationTimer = {
  props: ['arbitration'],
  computed: {
    factionImg() {
      if (this.arbitration?.enemy) {
        return fImg[this.arbitration?.enemy?.toLowerCase()] || corrupted;
      }
      return corrupted;
    },
  },
  render() {
    return (
      <div class="col-sm-3 my-3">
        <span style={textStyle}>{this.$t('arbitration.header')}</span>
        <HubImg
          src={this.factionImg}
          name={this.arbitration.enemy}
          class="li-mission-decorator li-mission-decorator-lg"
          height="20px"
          width="20px"
        />
        <br />
        <b>{this.arbitration.node}</b>
        <br />
        {this.arbitration.type}
        <TimeBadge
          starttime={this.arbitration.activation}
          endtime={this.arbitration.expiry}
          interval={1000}
          pullright={false}
        />
      </div>
    );
  },
};

export default {
  name: 'AggregatedTimePanel',
  props: {
    worldstate: {
      type: Object,
      default: () => ({
        cetusCycle: cycleDefault,
        earthCycle: cycleDefault,
        cambionCycle: cycleDefault,
        sentientOutposts: {},
        steelPath: {
          activation: 0,
          expiry: 0,
        },
      }),
    },
  },
  computed: {
    ...mapState({
      componentState: (state) => state.worldstate.components,
    }),
    now() {
      return dayjs().toISOString();
    },
    headertext() {
      return `${this.$t('time.Timer')}`;
    },
    isArbitrationActive() {
      return dayjs(this.worldstate.arbitration.expiry).format('x') <= dayjs().format('x');
    },
    isSentientOutpostActive() {
      return this.worldstate.sentientOutposts.active;
    },
  },
  methods: {
    cdn,
    wfcdn,
    optimize,
  },
  render() {
    return (
      <HubPanelWrap title={this.headertext} class="time">
        <b-list-group>
          <b-list-group-item class="list-group-item-borderbottom">
            <div class="container">
              <div class="row justify-content-center">
                {this.componentState.earth.display && <EarthTimer earthCycle={this.worldstate.earthCycle} />}
                {this.componentState.cetus.display && <CetusTimer cetusCycle={this.worldstate.cetusCycle} />}
                {this.componentState.vallis.display && <VallisTimer vallisCycle={this.worldstate.vallisCycle} />}
                {this.componentState.cambion.display && <CambionTimer cambionCycle={this.worldstate.cambionCycle} />}
                {this.componentState.reset.display && <ResetTimer />}
                {this.componentState.sentientoutposts.display && this.isSentientOutpostActive && (
                  <AnomalyTimer sentientOutposts={this.worldstate.sentientOutposts} />
                )}
                {this.componentState['steel-path'].display && <SteelPathTimer steelPath={this.worldstate.steelPath} />}
                {this.isArbitrationActive && this.componentState.arbitration.display && (
                  <ArbitrationTimer arbitration={this.worldstate.arbitration} />
                )}
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </HubPanelWrap>
    );
  },
};

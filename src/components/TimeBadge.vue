<template>
  <b-badge v-bind:variant="mutableVariant" v-bind:class="{ 'pull-right': pullright }" class="align-middle">
    {{ disp }}
  </b-badge>
</template>

<script>
import moment from 'moment';

export default {
  name: 'TimeBadge',
  props: {
    starttime: {
      type: String,
      default: '1970-01-01T00:00:00.000Z',
    },
    endtime: {
      type: String,
      default: '1970-01-01T00:00:00.000Z',
    },
    text: {
      type: String,
      default: '0s',
    },
    variant: {
      type: String,
      default: 'info',
    },
    interval: {
      type: Number,
      default: 60000,
    },
    counter: {
      type: Boolean,
      default: false,
    },
    pullright: {
      type: Boolean,
      default: true,
    },
  },
  mounted: function() {
    this.onBadgeUpdate();
  },
  data: function() {
    return {
      disp: this.text,
      mutableVariant: this.variant,
    };
  },
  methods: {
    formatDurationShort(duration) {
      let timeText = '';
      if (duration.days()) {
        timeText += `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
      } else if (duration.hours()) {
        timeText += `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
      } else if (duration.minutes()) {
        timeText += `${duration.minutes()}m ${duration.seconds()}s`;
      } else {
        timeText += `${duration.seconds()}s`;
      }
      if (timeText.includes('-')) {
        this.$parent.$forceUpdate();
      }
      return timeText;
    },
    formatTimer(diff) {
      let timeLeft = diff;
      const stringArray = [];

      [[86400000, 'd'], [3600000, 'h'], [60000, 'm'], [1000, 's']].forEach(([unit, suffix]) => {
        const time = Math.floor(timeLeft / unit);
        const first = stringArray.length === 0;
        if (!first || time > 0) {
          stringArray.push(time.toString().padStart(first ? 1 : 2, '0') + suffix);
        }
        timeLeft -= time * unit;
      });
      return stringArray.join(' ');
    },
    onBadgeUpdate() {
      let diffactivate;
      let durationactivate;

      const start = new Date(this.starttime).getTime() / 1000;

      if (typeof start !== 'undefined' && start !== false) {
        diffactivate = moment().diff(moment.unix(start)) * -1;
        durationactivate = moment.duration(diffactivate, 'milliseconds');
      }

      if (!this.counter) {
        const end = new Date(this.endtime).getTime() / 1000;

        // Get the diff and duration until "end"
        const diff = moment().diff(moment.unix(end)) * -1;
        const duration = moment.duration(diff, 'milliseconds');

        // Format based on there being no end time, being after the end, or being before the start
        if (!this.endtime) {
          this.disp = `${diffactivate > 0 ? '-' : ''}${this.formatTimer(Math.abs(diffactivate))}`;
        } else if (typeof diffactivate !== 'undefined' && diffactivate > 0) {
          this.mutableVariant = 'info';
          this.disp = `Starts in: ${this.formatDurationShort(durationactivate)}`;
        } else if (diff < 0) {
          this.mutableVariant = 'info';
          this.disp = `Expired: ${this.formatDurationShort(duration)}`;
        } else {
          if (diff < 600000) {
            // 0 min to 10 min
            this.mutableVariant = 'danger';
          } else if (diff < 1800000) {
            // 10 min to 30 min
            this.mutableVariant = 'warning';
          } else if (diff > 1800000) {
            // 30 min to 1 hour
            this.mutableVariant = 'success';
          } else {
            this.mutableVariant = 'info';
          }
          this.disp = this.formatTimer(diff);
        }
      } else {
        const diff = moment().diff(moment.unix(start));
        const duration = moment.duration(diff, 'milliseconds');

        if (typeof diffactivate !== 'undefined' && diffactivate > 0) {
          this.mutableVariant = 'transparent';
          this.disp = `Starts in: ${this.formatDurationShort(durationactivate)}`;
        } else {
          this.mutableVariant = 'transparent';
          this.disp = `Ongoing for: ${this.formatDurationShort(duration)}`;
        }
      }

      setTimeout(this.onBadgeUpdate, this.interval);
    },
  },
};
</script>

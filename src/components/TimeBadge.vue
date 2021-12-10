<template>
  <b-badge v-bind:variant="mutableVariant" v-bind:class="{ 'pull-right': pullright }" class="align-middle">
    {{ disp }}
  </b-badge>
</template>

<script>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const ten_minutes = 600000;
const thirty_minutes = 1800000;
const sixty_minutes = 3600000;

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
  mounted: function () {
    this.onBadgeUpdate();
  },
  data: function () {
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
        timeText = `-${timeText.replace(/-/g, '')}`;
      }
      return timeText;
    },
    formatTimer(diff) {
      let timeLeft = diff;
      const stringArray = [];

      [
        [86400000, 'd'],
        [3600000, 'h'],
        [60000, 'm'],
        [1000, 's'],
      ].forEach(([unit, suffix]) => {
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
      /** @type {number} time until active */
      let diffactivate;
      /** @type {Duration} total time active */
      let durationactivate;

      const start = new Date(this.starttime).getTime() / 1000;

      if (start) {
        diffactivate = dayjs().diff(dayjs.unix(start)) * -1;
        durationactivate = dayjs.duration(diffactivate, 'milliseconds');
      }

      if (!this.counter) {
        const end = new Date(this.endtime).getTime() / 1000;

        // Get the diff and duration until "end"
        const diff = dayjs().diff(dayjs.unix(end)) * -1;
        /** @type {Duration} duration from now until the end */
        const duration = dayjs.duration({ milliseconds: diff });

        duration.parseFromMilliseconds();
        durationactivate.parseFromMilliseconds();

        // Format based on there being no end time, being after the end, or being before the start
        if (!this.endtime) {
          // End exists
          this.disp = `${diffactivate > 0 ? '-' : ''}${this.formatTimer(Math.abs(diffactivate))}`;
        } else if (typeof diffactivate !== 'undefined' && diffactivate > 0) {
          // currently still active & time remaining
          this.mutableVariant = 'info';
          this.disp = `${this.$t('time.startL')} ${this.formatDurationShort(durationactivate)}`;
        } else if (diff < 0) {
          this.type = 'after the end';
          // past the end
          this.mutableVariant = 'info';
          this.disp = `${this.$t('time.expiredL')}: ${this.formatDurationShort(duration)}`;
        } else {
          this.type = `the diff works @ ${diff}`;
          if (diff < ten_minutes) {
            // 0 min to 10 min
            this.mutableVariant = 'danger';
          } else if (diff < thirty_minutes) {
            // 10 min to 30 min
            this.mutableVariant = 'warning';
          } else if (diff < sixty_minutes) {
            // 30 min to 1 hour
            this.mutableVariant = 'success';
          } else {
            // all others
            this.mutableVariant = 'info';
          }
          this.disp = this.formatTimer(diff);
        }
      } else {
        const diff = dayjs().diff(dayjs.unix(start));
        const duration = dayjs.duration({ milliseconds: diff });

        durationactivate.parseFromMilliseconds();
        duration.parseFromMilliseconds();

        this.mutableVariant = 'transparent';
        if (typeof diffactivate !== 'undefined' && diffactivate > 0) {
          this.disp = `${this.$t('time.startL')} ${this.formatDurationShort(durationactivate)}`;
        } else {
          this.disp = `${this.$t('time.ongoingL')} ${this.formatDurationShort(duration)}`;
        }
      }

      setTimeout(this.onBadgeUpdate, this.interval);
    },
  },
};
</script>

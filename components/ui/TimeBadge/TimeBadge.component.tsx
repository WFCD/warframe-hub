'use client';
import './TimeBadge.component.scss';

import { useCallback, useEffect, useState, type CSSProperties, type FC } from 'react';
import { Chip } from '@heroui/react';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { useTranslation } from 'react-i18next';

import { isRealInstant, parseInstant } from '@/lib/shared/time';

dayjs.extend(durationPlugin);

type DayjsDuration = ReturnType<typeof dayjs.duration>;

const tenMinutes = 600000;
const thirtyMinutes = 1800000;
const sixtyMinutes = 3600000;
const defaultCoarseHoursAbove = 7200000;

export type TimeBadgeTone = 'info' | 'success' | 'warning' | 'danger' | 'transparent';

type ChipColor = 'accent' | 'success' | 'warning' | 'danger' | 'default';

export { parseInstant } from '@/lib/shared/time';

export const timeBadgeChipColor = (tone: TimeBadgeTone | string): ChipColor => {
  if (tone === 'info' || tone === 'accent') return 'accent';
  if (tone === 'success' || tone === 'warning' || tone === 'danger') return tone;
  return 'default';
};

type TimeBadgeProps = {
  starttime?: string;
  endtime?: string;
  text?: string;
  variant?: TimeBadgeTone;
  interval?: number;
  counter?: boolean;
  pullright?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** When remaining ms is at or above this threshold, show hours only (e.g. 2h, 1d 3h). Pass `null` to disable. */
  coarseHoursAbove?: number | null;
};

export const formatTimer = (diff: number): string => {
  if (!Number.isFinite(diff) || diff < 0) {
    return '0s';
  }

  let timeLeft = diff;
  const stringArray: string[] = [];

  (
    [
      [86400000, 'd'],
      [3600000, 'h'],
      [60000, 'm'],
      [1000, 's'],
    ] as const
  ).forEach(([unit, suffix]) => {
    const time = Math.floor(timeLeft / unit);
    const first = stringArray.length === 0;
    if (!first || time > 0) {
      stringArray.push(time.toString().padStart(first ? 1 : 2, '0') + suffix);
    }
    timeLeft -= time * unit;
  });
  return stringArray.join(' ') || '0s';
};

export const formatTimerCoarseHours = (diff: number): string => {
  if (!Number.isFinite(diff) || diff < 0) {
    return '0h';
  }

  const totalHours = Math.ceil(diff / 3600000);
  if (totalHours <= 0) {
    return '0h';
  }

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }

  return `${totalHours}h`;
};

const formatDurationShort = (d: DayjsDuration, coarseHoursAbove?: number): string => {
  const ms = Math.abs(d.asMilliseconds());
  if (coarseHoursAbove !== undefined && ms >= coarseHoursAbove) {
    return formatTimerCoarseHours(ms);
  }

  let timeText = '';
  if (d.days()) {
    timeText += `${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`;
  } else if (d.hours()) {
    timeText += `${d.hours()}h ${d.minutes()}m ${d.seconds()}s`;
  } else if (d.minutes()) {
    timeText += `${d.minutes()}m ${d.seconds()}s`;
  } else {
    timeText += `${d.seconds()}s`;
  }
  if (timeText.includes('-')) {
    timeText = `-${timeText.replace(/-/g, '')}`;
  }
  return timeText;
};

const formatCountdown = (diff: number, coarseHoursAbove?: number): string => {
  if (coarseHoursAbove !== undefined && diff >= coarseHoursAbove) {
    return formatTimerCoarseHours(diff);
  }
  return formatTimer(diff);
};

const TimeBadge: FC<TimeBadgeProps> = ({
  starttime = '1970-01-01T00:00:00.000Z',
  endtime = '1970-01-01T00:00:00.000Z',
  text = '0s',
  variant = 'info',
  interval = 60000,
  counter = false,
  pullright = true,
  className,
  style,
  id,
  coarseHoursAbove = defaultCoarseHoursAbove,
}: TimeBadgeProps) => {
  const { t } = useTranslation();
  const [disp, setDisp] = useState(text);
  const [tone, setTone] = useState<TimeBadgeTone>(variant);
  const [tickInterval, setTickInterval] = useState(interval);

  const onBadgeUpdate = useCallback(() => {
    const coarseAbove = coarseHoursAbove ?? undefined;
    const startAt = parseInstant(starttime);
    const endAt = parseInstant(endtime);
    const start = isRealInstant(startAt) ? startAt : undefined;
    const end = isRealInstant(endAt) ? endAt : undefined;

    let diffactivate: number | undefined;
    let durationactivate: DayjsDuration | undefined;

    if (start) {
      diffactivate = start.diff(dayjs(), 'millisecond');
      durationactivate = dayjs.duration(diffactivate);
    }

    if (!counter) {
      if (!end) {
        setTone('info');
        setTickInterval(interval);
        setDisp(
          `${diffactivate && diffactivate > 0 ? '-' : ''}${formatCountdown(Math.abs(diffactivate ?? 0), coarseAbove)}`
        );
        return;
      }

      const diff = end.diff(dayjs(), 'millisecond');
      const duration = dayjs.duration(Math.abs(diff));
      const useCoarse = coarseAbove !== undefined && diff >= coarseAbove;

      if (diffactivate && diffactivate > 0) {
        setTone('info');
        setTickInterval(useCoarse ? 60000 : interval);
        setDisp(`${t('time.startL')} ${formatDurationShort(durationactivate!, coarseAbove)}`);
      } else if (diff <= 0) {
        setTone('info');
        setTickInterval(interval);
        setDisp(`${t('time.expiredL')}: ${formatDurationShort(duration, coarseAbove)}`);
      } else {
        if (diff < tenMinutes) {
          setTone('danger');
        } else if (diff < thirtyMinutes) {
          setTone('warning');
        } else if (diff < sixtyMinutes) {
          setTone('success');
        } else {
          setTone('info');
        }
        setTickInterval(useCoarse ? 60000 : Math.min(interval, 1000));
        setDisp(formatCountdown(diff, coarseAbove));
      }
    } else {
      const diff = start ? dayjs().diff(start, 'millisecond') : 0;
      const duration = dayjs.duration(diff);
      const useCoarse = coarseAbove !== undefined && diff >= coarseAbove;

      setTone('transparent');
      setTickInterval(useCoarse ? 60000 : interval);
      if (diffactivate && diffactivate > 0) {
        setDisp(`${t('time.startL')} ${formatDurationShort(durationactivate!, coarseAbove)}`);
      } else {
        setDisp(`${t('time.ongoingL')} ${formatDurationShort(duration, coarseAbove)}`);
      }
    }
  }, [starttime, endtime, counter, t, interval, coarseHoursAbove]);

  useEffect(() => {
    onBadgeUpdate();
    const timerId = setInterval(onBadgeUpdate, tickInterval);
    return () => clearInterval(timerId);
  }, [onBadgeUpdate, tickInterval]);

  const classes = [
    'hub-time-badge inline-flex items-center gap-1',
    pullright ? 'float-right' : '',
    'align-middle',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Chip id={id} className={classes} color={timeBadgeChipColor(tone)} size='sm' variant='soft' style={style}>
      {disp}
    </Chip>
  );
};

export { defaultCoarseHoursAbove };

/** Smaller chip layout for dense rows (sales, darvo, cycle bar). */
export const compactTimeBadgeProps = {
  className: 'text-[0.62rem] min-h-[1.05rem] px-1.5',
  pullright: false,
} as const;

export default TimeBadge;

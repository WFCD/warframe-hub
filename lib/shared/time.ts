import dayjs, { type Dayjs } from 'dayjs';

/** API / worldstate sentinel for “no real time” (string `"0"` or epoch). */
export const API_TIME_EPOCH_ISO = '1970-01-01T00:00:00.000Z';

/**
 * Parse a worldstate / API instant.
 * - missing / empty → `null`
 * - literal `"0"` or unparseable → epoch (`dayjs(0)`), same sentinel as API `"0"`
 * - valid timestamp → dayjs instance
 */
export const parseInstant = (value?: string | null): Dayjs | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (value === '0') {
    return dayjs(0);
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : dayjs(0);
};

/** Non-null instant that is not the API epoch placeholder. */
export const isRealInstant = (value: Dayjs | null | undefined): value is Dayjs =>
  Boolean(value && value.valueOf() !== 0);

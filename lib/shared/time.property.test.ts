import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import { API_TIME_EPOCH_ISO, isRealInstant, parseInstant } from './time';

test('parseInstant returns null for missing or empty values', () => {
  fc.assert(
    fc.property(fc.constantFrom(undefined, null, ''), (value) => {
      assert.equal(parseInstant(value), null);
    }),
  );
});

test('parseInstant maps sentinel 0 and invalid strings to epoch', () => {
  fc.assert(
    fc.property(fc.constantFrom('0', 'not-a-date', 'garbage', '???'), (value) => {
      const parsed = parseInstant(value);
      assert.ok(parsed);
      assert.equal(parsed!.valueOf(), 0);
      assert.equal(isRealInstant(parsed), false);
    }),
  );
});

test('parseInstant preserves valid timestamps', () => {
  fc.assert(
    fc.property(
      fc.date({ noInvalidDate: true }).filter((d) => d.getTime() !== 0),
      (date) => {
        const iso = date.toISOString();
        const parsed = parseInstant(iso);
        assert.ok(isRealInstant(parsed));
        assert.equal(parsed!.toISOString(), iso);
      },
    ),
  );
});

test('API_TIME_EPOCH_ISO matches dayjs(0)', () => {
  assert.equal(parseInstant(API_TIME_EPOCH_ISO)?.toISOString(), API_TIME_EPOCH_ISO);
  assert.equal(isRealInstant(parseInstant(API_TIME_EPOCH_ISO)), false);
});

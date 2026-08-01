import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import { isArbitrationActive, stripInactiveArbitration } from './arbitration.ts';

const loadingArb = fc.constantFrom('Loading...', 'SolNode000', 'Tenno');

test('isArbitrationActive rejects non-objects and expired placeholders', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        fc.constant(null),
        fc.constant(undefined),
        fc.string(),
        fc.integer(),
        fc.boolean(),
        fc.array(fc.anything()),
      ),
      (value) => {
        assert.equal(isArbitrationActive(value), false);
      },
    ),
  );

  fc.assert(
    fc.property(
      fc.record({
        expired: fc.constant(true),
        expiry: fc.constant(new Date(Date.now() + 60_000).toISOString()),
        node: fc.string({ maxLength: 24 }),
        enemy: fc.string({ maxLength: 24 }),
        type: fc.string({ maxLength: 24 }),
      }),
      (arbitration) => {
        assert.equal(isArbitrationActive(arbitration), false);
      },
    ),
  );
});

test('isArbitrationActive rejects known loading / placeholder shapes', () => {
  fc.assert(
    fc.property(loadingArb, (marker) => {
      assert.equal(
        isArbitrationActive({
          expiry: new Date(Date.now() + 60_000).toISOString(),
          node: marker === 'SolNode000' ? marker : 'Earth',
          nodeKey: marker === 'SolNode000' ? marker : 'Earth',
          enemy: marker === 'Loading...' || marker === 'Tenno' ? marker : 'Grineer',
          type: marker === 'Loading...' ? marker : 'Survival',
          typeKey: marker === 'Tenno' ? 'Unknown' : 'Survival',
        }),
        false,
      );
    }),
  );
});

test('isArbitrationActive requires a finite future expiry', () => {
  fc.assert(
    fc.property(
      fc.record({
        expiry: fc.constantFrom('', '0', 'not-a-date', '99999-01-01T00:00:00.000Z'),
        node: fc.constant('Earth'),
        enemy: fc.constant('Grineer'),
        type: fc.constant('Survival'),
      }),
      (arbitration) => {
        assert.equal(isArbitrationActive(arbitration), false);
      },
    ),
  );

  assert.equal(
    isArbitrationActive({
      expiry: new Date(Date.now() + 120_000).toISOString(),
      node: 'Earth',
      enemy: 'Grineer',
      type: 'Survival',
    }),
    true,
  );
});

test('isArbitrationActive treats invalid expiry like sentinel 0', () => {
  const base = { node: 'Earth', enemy: 'Grineer', type: 'Survival' };
  assert.equal(isArbitrationActive({ ...base, expiry: '0' }), false);
  assert.equal(isArbitrationActive({ ...base, expiry: 'not-a-date' }), false);
  assert.equal(isArbitrationActive({ ...base, expiry: 'garbage' }), false);
});
test('stripInactiveArbitration removes inactive arbitration only', () => {
  fc.assert(
    fc.property(
      fc.record({
        timestamp: fc.constant(new Date().toISOString()),
        arbitration: fc.option(
          fc.record({
            expired: fc.boolean(),
            expiry: fc.option(
              fc.date().map((d) => (Number.isNaN(d.getTime()) ? '0' : d.toISOString())),
              { nil: undefined },
            ),
            node: fc.oneof(fc.constant('Loading...'), fc.string({ maxLength: 16 })),
            enemy: fc.oneof(fc.constant('Loading...'), fc.string({ maxLength: 16 })),
            type: fc.oneof(fc.constant('Loading...'), fc.string({ maxLength: 16 })),
          }),
          { nil: undefined },
        ),
      }),
      (ws) => {
        const stripped = stripInactiveArbitration(ws as never);
        if (isArbitrationActive(ws.arbitration)) {
          assert.equal(stripped.arbitration, ws.arbitration);
        } else {
          assert.equal('arbitration' in stripped, false);
        }
      },
    ),
  );
});

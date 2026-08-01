import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import type { ComponentsMap } from '../shared/types/prefs';
import {
  DEFAULT_MASONRY_PANEL_ORDER,
  isMasonryPanelKey,
  MASONRY_PANEL_KEYS,
  normalizeComponentOrder,
  type MasonryPanelKey,
} from './masonryPanels';

const masonryKeyArb = fc.constantFrom(...MASONRY_PANEL_KEYS);

const componentsArb = fc.dictionary(
  masonryKeyArb,
  fc.record({
    display: fc.boolean(),
    displayable: fc.option(fc.boolean(), { nil: undefined }),
    key: fc.string({ minLength: 1, maxLength: 24 }),
  }),
) as fc.Arbitrary<ComponentsMap>;

const storedOrderArb = fc.array(fc.oneof(masonryKeyArb, fc.string({ maxLength: 24 })), {
  maxLength: 40,
});

test('normalizeComponentOrder only returns displayable masonry keys, unique', () => {
  fc.assert(
    fc.property(storedOrderArb, componentsArb, (stored, components) => {
      const ordered = normalizeComponentOrder(stored, components);
      const displayable = new Set(
        MASONRY_PANEL_KEYS.filter((key) => components[key]?.displayable !== false),
      );

      assert.equal(ordered.length, new Set(ordered).size);
      for (const key of ordered) {
        assert.ok(isMasonryPanelKey(key));
        assert.ok(displayable.has(key));
      }
      assert.equal(ordered.length, displayable.size);
    }),
  );
});

test('normalizeComponentOrder is idempotent', () => {
  fc.assert(
    fc.property(storedOrderArb, componentsArb, (stored, components) => {
      const once = normalizeComponentOrder(stored, components);
      assert.deepEqual(normalizeComponentOrder(once, components), once);
    }),
  );
});

test('normalizeComponentOrder preserves first-seen valid stored order', () => {
  fc.assert(
    fc.property(fc.array(masonryKeyArb, { maxLength: 30 }), componentsArb, (stored, components) => {
      const ordered = normalizeComponentOrder(stored, components);
      const displayableStored = stored.filter(
        (key, index) =>
          stored.indexOf(key) === index && components[key]?.displayable !== false,
      ) as MasonryPanelKey[];

      assert.deepEqual(ordered.slice(0, displayableStored.length), displayableStored);
    }),
  );
});

test('DEFAULT_MASONRY_PANEL_ORDER covers every masonry key exactly once', () => {
  assert.equal(DEFAULT_MASONRY_PANEL_ORDER.length, MASONRY_PANEL_KEYS.length);
  assert.equal(new Set(DEFAULT_MASONRY_PANEL_ORDER).size, MASONRY_PANEL_KEYS.length);
  for (const key of MASONRY_PANEL_KEYS) {
    assert.ok(DEFAULT_MASONRY_PANEL_ORDER.includes(key));
  }
});

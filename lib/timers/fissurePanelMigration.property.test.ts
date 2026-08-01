import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import type { ComponentsMap } from '../shared/types/prefs';
import {
  FISSURE_PANEL_KEYS,
  isFissureDisplayIncluded,
  migrateFissurePanels,
} from './fissurePanelMigration';

const displayModes = [
  'fissures',
  'storms',
  'steelPath',
  'fissures-storms',
  'fissures-storms-steelPath',
  'fissures-steelPath',
  'storms-steelPath',
  '',
  'other',
] as const;

const kinds = ['fissures', 'storms', 'steelPath'] as const;

const componentConfigArb = fc.record({
  display: fc.boolean(),
  displayable: fc.option(fc.boolean(), { nil: undefined }),
  key: fc.string({ minLength: 1, maxLength: 24 }),
});

test('isFissureDisplayIncluded is deterministic for known modes', () => {
  fc.assert(
    fc.property(fc.constantFrom(...displayModes), fc.constantFrom(...kinds), (displays, kind) => {
      const once = isFissureDisplayIncluded(displays, kind);
      assert.equal(typeof once, 'boolean');
      assert.equal(isFissureDisplayIncluded(displays, kind), once);
    }),
  );
});

test('fissures-storms-steelPath (and legacy fissures-storms) include every kind', () => {
  for (const displays of ['fissures-storms-steelPath', 'fissures-storms'] as const) {
    for (const kind of kinds) {
      assert.equal(isFissureDisplayIncluded(displays, kind), true);
    }
  }
});

test('migrateFissurePanels expands fissures order into three panel keys once', () => {
  fc.assert(
    fc.property(
      fc.array(fc.oneof(fc.constantFrom(...FISSURE_PANEL_KEYS), fc.string({ maxLength: 16 })), {
        maxLength: 20,
      }),
      fc.constantFrom(...displayModes),
      (componentOrder, fissureDisplays) => {
        const defaults: ComponentsMap = {
          fissures: { display: true, key: 'fissures' },
          voidStorms: { display: true, key: 'voidStorms' },
          steelPathFissures: { display: true, key: 'steelPathFissures' },
        };
        const stored: ComponentsMap = {
          fissures: { display: true, key: 'fissures' },
        };

        const { componentOrder: order } = migrateFissurePanels(
          stored,
          defaults,
          fissureDisplays,
          componentOrder,
        );

        if (componentOrder.includes('fissures') && !componentOrder.includes('voidStorms')) {
          const fissureIndex = order.indexOf('fissures');
          assert.ok(fissureIndex >= 0);
          assert.deepEqual(order.slice(fissureIndex, fissureIndex + 3), [...FISSURE_PANEL_KEYS]);
        }
      },
    ),
  );
});

test('migrateFissurePanels is stable when voidStorms already present', () => {
  fc.assert(
    fc.property(
      componentConfigArb,
      componentConfigArb,
      componentConfigArb,
      fc.constantFrom(...displayModes),
      fc.array(fc.string({ maxLength: 16 }), { maxLength: 12 }),
      (fissures, voidStorms, steelPathFissures, fissureDisplays, componentOrder) => {
        const stored: ComponentsMap = {
          fissures: { ...fissures, key: 'fissures' },
          voidStorms: { ...voidStorms, key: 'voidStorms' },
          steelPathFissures: { ...steelPathFissures, key: 'steelPathFissures' },
        };
        const defaults: ComponentsMap = {
          fissures: { display: true, key: 'fissures' },
          voidStorms: { display: false, key: 'voidStorms' },
          steelPathFissures: { display: false, key: 'steelPathFissures' },
        };

        const first = migrateFissurePanels(stored, defaults, fissureDisplays, componentOrder);
        const second = migrateFissurePanels(
          first.components,
          defaults,
          fissureDisplays,
          first.componentOrder,
        );
        assert.deepEqual(second.components.fissures?.display, first.components.fissures?.display);
        assert.deepEqual(second.components.voidStorms?.display, first.components.voidStorms?.display);
        assert.deepEqual(
          second.components.steelPathFissures?.display,
          first.components.steelPathFissures?.display,
        );
      },
    ),
  );
});

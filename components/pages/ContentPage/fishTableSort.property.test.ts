import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import {
  compareFishValues,
  deimosSpearTier,
  parseFishMass,
  parseFishRarity,
  poeSpearTier,
  type FishSortValue,
} from './fishTableSort';

const fishValueArb: fc.Arbitrary<FishSortValue> = fc.oneof(
  fc.string({ maxLength: 24 }),
  fc.integer({ min: -1_000_000, max: 1_000_000 }),
  fc.boolean(),
);

test('parseFishRarity extracts leading tier number when present', () => {
  fc.assert(
    fc.property(fc.nat({ max: 99 }), fc.string({ maxLength: 24 }), (tier, rest) => {
      const rarity = `${tier}-${rest}`;
      assert.equal(parseFishRarity(rarity), tier);
    }),
  );
});

test('parseFishRarity returns original string when no leading tier', () => {
  fc.assert(
    fc.property(
      fc.string({ maxLength: 32 }).filter((value) => !/^\d+-/.test(value)),
      (rarity) => {
        assert.equal(parseFishRarity(rarity), rarity);
      },
    ),
  );
});

test('parseFishMass extracts leading numeric mass when present', () => {
  fc.assert(
    fc.property(
      // Fixed-point masses avoid scientific notation, which /^([\d.]+)/ only partially matches.
      fc.integer({ min: 0, max: 1_000_000 }).map((n) => n / 1000),
      fc.string({ maxLength: 12 }).filter((s) => !/^\d/.test(s)),
      (mass, suffix) => {
        const formatted = `${mass}${suffix}`;
        const parsed = parseFishMass(formatted);
        assert.equal(typeof parsed, 'number');
        assert.ok(Math.abs((parsed as number) - mass) < 1e-9);
      },
    ),
  );
});

test('compareFishValues is reflexive and antisymmetric for equal pairs', () => {
  fc.assert(
    fc.property(fishValueArb, (value) => {
      assert.equal(compareFishValues(value, value), 0);
    }),
  );
});

test('compareFishValues flips sign when arguments swap (non-zero)', () => {
  fc.assert(
    fc.property(fishValueArb, fishValueArb, (a, b) => {
      const left = compareFishValues(a, b);
      const right = compareFishValues(b, a);
      if (left === 0) {
        assert.equal(right, 0);
        return;
      }
      assert.equal(Math.sign(left), -Math.sign(right));
    }),
  );
});

test('spear tiers prefer higher-priority spears', () => {
  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (lanzo, tulok, peram) => {
      const tier = poeSpearTier({ lanzo, tulok, peram });
      if (lanzo) assert.equal(tier, 1);
      else if (tulok) assert.equal(tier, 2);
      else if (peram) assert.equal(tier, 3);
      else assert.equal(tier, 4);
    }),
  );

  fc.assert(
    fc.property(fc.boolean(), fc.boolean(), (spari, ebisu) => {
      const tier = deimosSpearTier({ spari, ebisu });
      if (spari) assert.equal(tier, 1);
      else if (ebisu) assert.equal(tier, 2);
      else assert.equal(tier, 3);
    }),
  );
});

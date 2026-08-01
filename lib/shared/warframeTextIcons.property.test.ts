import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import { dtAssetKey, genesisDtIconUrl, GENESIS_EMOJI_BASE } from './warframeTextIcons.ts';

const KNOWN_ALIASES = [
  'IMPACT',
  'FIRE',
  'FREEZE',
  'POISON',
  'EXPLOSION',
  'SENTIENT',
  'RADIANT_COLOR',
] as const;

test('dtAssetKey maps known aliases to valid lowercase asset keys', () => {
  fc.assert(
    fc.property(fc.constantFrom(...KNOWN_ALIASES), (tag) => {
      const key = dtAssetKey(tag);
      assert.ok(key);
      assert.match(key!, /^[a-z]+$/);
      assert.equal(dtAssetKey(tag.toLowerCase()), key);
    }),
  );
});

test('dtAssetKey never invents keys outside the valid set for random tags', () => {
  fc.assert(
    fc.property(fc.string({ minLength: 1, maxLength: 32 }), (tag) => {
      const key = dtAssetKey(tag);
      if (key === null) return;
      assert.match(key, /^[a-z]+$/);
      assert.equal(genesisDtIconUrl(tag), `${GENESIS_EMOJI_BASE}/${key}.png`);
    }),
  );
});

test('genesisDtIconUrl is null exactly when dtAssetKey is null', () => {
  fc.assert(
    fc.property(fc.string({ maxLength: 48 }), (tag) => {
      assert.equal(genesisDtIconUrl(tag) === null, dtAssetKey(tag) === null);
    }),
  );
});

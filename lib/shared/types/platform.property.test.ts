import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import { normalizePlatform, PLATFORMS, type Platform } from './platform.ts';

test('normalizePlatform always returns a known platform', () => {
  fc.assert(
    fc.property(fc.option(fc.string(), { nil: undefined }), (input) => {
      const platform = normalizePlatform(input);
      assert.ok((PLATFORMS as readonly string[]).includes(platform));
    }),
  );
});

test('normalizePlatform maps known aliases', () => {
  fc.assert(
    fc.property(
      fc.constantFrom<[string, Platform]>(
        ['pc', 'pc'],
        ['ps4', 'ps4'],
        ['xb1', 'xb1'],
        ['switch', 'switch'],
        ['swi', 'switch'],
      ),
      ([input, expected]) => {
        assert.equal(normalizePlatform(input), expected);
      },
    ),
  );
});

test('normalizePlatform defaults unknown strings to pc', () => {
  fc.assert(
    fc.property(
      fc.string().filter((s) => !['pc', 'ps4', 'xb1', 'switch', 'swi'].includes(s)),
      (input) => {
        assert.equal(normalizePlatform(input), 'pc');
      },
    ),
  );
});

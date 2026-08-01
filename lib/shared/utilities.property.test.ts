import assert from 'node:assert/strict';
import test from 'node:test';
import fc from 'fast-check';

import { cdn, dedupeRewardPool, optimize, wfcdn } from './utilities';

test('dedupeRewardPool keeps first-seen order and unique values', () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (rewards) => {
      const unique = dedupeRewardPool(rewards);
      assert.equal(unique.length, new Set(unique).size);
      assert.ok(unique.length <= rewards.length);

      let lastIndex = -1;
      for (const reward of unique) {
        const index = rewards.indexOf(reward);
        assert.ok(index > lastIndex);
        lastIndex = index;
      }
    }),
  );
});

test('dedupeRewardPool is idempotent', () => {
  fc.assert(
    fc.property(fc.option(fc.array(fc.string()), { nil: undefined }), (rewards) => {
      const once = dedupeRewardPool(rewards);
      assert.deepEqual(dedupeRewardPool(once), once);
    }),
  );
});

test('cdn and wfcdn always point at warframestat CDN hosts', () => {
  fc.assert(
    fc.property(fc.string({ minLength: 1, maxLength: 64 }), (path) => {
      assert.match(cdn(path), /^https:\/\/cdn\.warframestat\.us\/genesis\//);
      assert.match(wfcdn(path), /^https:\/\/cdn\.warframestat\.us\/img\//);
      assert.ok(cdn(path).endsWith(path));
      assert.ok(wfcdn(path).endsWith(path));
    }),
  );
});

test('optimize always emits webp progressive CDN URL', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1, maxLength: 64 }),
      fc.option(fc.stringMatching(/^[0-9]+x[0-9]+$/), { nil: undefined }),
      (img, size) => {
        const url = optimize(img, size);
        assert.match(url, /^https:\/\/cdn\.warframestat\.us\//);
        assert.ok(url.includes('o_webp,progressive_true/'));
        assert.ok(url.endsWith(img));
        if (size) assert.ok(url.includes(`rs_${size}_`));
      },
    ),
  );
});

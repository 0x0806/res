'use strict';
const assert = require('assert');
const r = process.memoryUsage();
if (!common.isIBMi) {
  assert.ok(r.rss > 0);
  assert.ok(process.memoryUsage.rss() > 0);
}
assert.ok(r.heapTotal > 0);
assert.ok(r.heapUsed > 0);
assert.ok(r.external > 0);
assert.strictEqual(typeof r.arrayBuffers, 'number');
if (r.arrayBuffers > 0) {
  const size = 10 * 1024 * 1024;
  const ab = new ArrayBuffer(size);
  const after = process.memoryUsage();
  assert.ok(after.external - r.external >= size,
            `${after.external} - ${r.external} >= ${size}`);
  assert.strictEqual(after.arrayBuffers - r.arrayBuffers, size,
                     `${after.arrayBuffers} - ${r.arrayBuffers} === ${size}`);
}

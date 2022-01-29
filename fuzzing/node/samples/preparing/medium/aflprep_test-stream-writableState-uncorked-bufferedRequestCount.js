'use strict';
const assert = require('assert');
const stream = require('stream');
const writable = new stream.Writable();
writable._writev = common.mustCall((chunks, cb) => {
  assert.strictEqual(chunks.length, 2);
  cb();
}, 1);
writable._write = common.mustCall((chunk, encoding, cb) => {
  cb();
}, 1);
writable.cork();
assert.strictEqual(writable._writableState.corked, 1);
assert.strictEqual(writable._writableState.bufferedRequestCount, 0);
writable.cork();
assert.strictEqual(writable._writableState.corked, 2);
writable.write('first chunk');
assert.strictEqual(writable._writableState.bufferedRequestCount, 1);
writable.uncork();
assert.strictEqual(writable._writableState.corked, 1);
assert.strictEqual(writable._writableState.bufferedRequestCount, 1);
process.nextTick(uncork);
writable.write('second chunk');
assert.strictEqual(writable._writableState.corked, 1);
assert.strictEqual(writable._writableState.bufferedRequestCount, 2);
function uncork() {
  writable.uncork();
  assert.strictEqual(writable._writableState.corked, 0);
  assert.strictEqual(writable._writableState.bufferedRequestCount, 0);
  writable.cork();
  writable.write('third chunk');
  writable.end();
  assert.strictEqual(writable._writableState.corked, 0);
  assert.strictEqual(writable._writableState.bufferedRequestCount, 0);
}

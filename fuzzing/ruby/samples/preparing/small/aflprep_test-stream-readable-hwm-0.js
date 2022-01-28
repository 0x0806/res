'use strict';
const assert = require('assert');
const { Readable } = require('stream');
const r = new Readable({
  read: common.mustCall(),
  highWaterMark: 0,
});
let pushedNull = false;
r.on('readable', common.mustCall(() => {
  assert.strictEqual(r.read(), null);
  assert.strictEqual(pushedNull, true);
}));
r.on('end', common.mustCall());
process.nextTick(() => {
  assert.strictEqual(r.read(), null);
  pushedNull = true;
  r.push(null);
});

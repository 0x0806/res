'use strict';
const assert = require('assert');
runMakeCallback(5, common.mustCall((err, val) => {
  assert.strictEqual(err, null);
  assert.strictEqual(val, 10);
  process.nextTick(common.mustCall());
}));

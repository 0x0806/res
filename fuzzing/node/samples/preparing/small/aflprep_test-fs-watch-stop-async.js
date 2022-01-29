'use strict';
const assert = require('assert');
const fs = require('fs');
const watch = fs.watchFile(__filename, common.mustNotCall());
let triggered;
const listener = common.mustCall(() => {
  triggered = true;
});
triggered = false;
watch.stop();
assert.strictEqual(triggered, false);
setImmediate(() => {
  assert.strictEqual(triggered, true);
  watch.removeListener('stop', listener);
});

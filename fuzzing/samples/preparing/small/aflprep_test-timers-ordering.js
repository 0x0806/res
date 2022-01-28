'use strict';
const assert = require('assert');
const { getLibuvNow } = internalBinding('timers');
const N = 30;
let last_i = 0;
let last_ts = 0;
function f(i) {
  if (i <= N) {
    assert.strictEqual(i, last_i + 1, `order is broken: ${i} != ${last_i} + 1`);
    last_i = i;
    const now = getLibuvNow();
    assert(now >= last_ts + 1,
           `current ts ${now} < prev ts ${last_ts} + 1`);
    last_ts = now;
    setTimeout(f, 1, i + 1);
  }
}
setTimeout(f, 1, 1);

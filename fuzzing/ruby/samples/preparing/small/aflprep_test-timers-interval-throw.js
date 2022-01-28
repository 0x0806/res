'use strict';
const assert = require('assert');
let count = 2;
const interval = setInterval(() => { throw new Error('IntervalError'); }, 1);
process.on('uncaughtException', common.mustCall((err) => {
  assert.strictEqual(err.message, 'IntervalError');
  if (--count === 0) {
    clearInterval(interval);
  }
}, 2));

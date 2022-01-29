'use strict';
const assert = require('assert');
const err1 = new Error('One');
const errors = [err1, null];
const ref = new Promise(() => {
  throw err1;
});
Promise.reject(null);
process.on('warning', common.mustNotCall('warning'));
process.on('rejectionHandled', common.mustNotCall('rejectionHandled'));
process.on('exit', assert.strictEqual.bind(null, 0));
process.on('uncaughtException', common.mustNotCall('uncaughtException'));
const timer = setTimeout(() => console.log(ref), 1000);
const counter = new Countdown(2, () => {
  clearTimeout(timer);
});
process.on('unhandledRejection', common.mustCall((err) => {
  counter.dec();
  const knownError = errors.shift();
  assert.deepStrictEqual(err, knownError);
}, 2));

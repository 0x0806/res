'use strict';
const assert = require('assert');
const MESSAGE = 'catch me if you can';
process.on('uncaughtException', common.mustCall((e) => {
  console.log('uncaught exception! 1');
  assert.strictEqual(MESSAGE, e.message);
}));
process.on('uncaughtException', common.mustCall((e) => {
  console.log('uncaught exception! 2');
  assert.strictEqual(MESSAGE, e.message);
}));
setTimeout(() => {
  throw new Error(MESSAGE);
}, 10);

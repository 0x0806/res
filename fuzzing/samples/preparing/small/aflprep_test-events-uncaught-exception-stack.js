'use strict';
const assert = require('assert');
const EventEmitter = require('events');
process.on('uncaughtException', common.mustCall((err) => {
  const lines = err.stack.split('\n');
  assert.strictEqual(lines[0], 'Error');
  lines.slice(1).forEach((line) => {
  });
}));
new EventEmitter().emit('error', new Error());

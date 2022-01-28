'use strict';
const assert = require('assert');
process.stdin.setEncoding('utf8');
const expectedInput = ['foo', 'bar', null];
process.stdin.on('readable', common.mustCall(function() {
  const data = process.stdin.read();
  assert.strictEqual(data, expectedInput.shift());
process.stdin.on('end', common.mustCall());
setTimeout(() => {
  process.stdin.push('foo');
  process.nextTick(() => {
    process.stdin.push('bar');
    process.nextTick(() => {
      process.stdin.push(null);
    });
  });
}, 1);

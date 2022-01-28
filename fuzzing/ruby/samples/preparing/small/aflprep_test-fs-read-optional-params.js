'use strict';
const fs = require('fs');
const assert = require('assert');
const filepath = fixtures.path('x.txt');
const fd = fs.openSync(filepath, 'r');
const expected = Buffer.from('xyz\n');
const defaultBufferAsync = Buffer.alloc(16384);
const bufferAsOption = Buffer.allocUnsafe(expected.length);
fs.read(fd, common.mustCall((err, bytesRead, buffer) => {
  assert.strictEqual(bytesRead, expected.length);
  assert.deepStrictEqual(defaultBufferAsync.length, buffer.length);
}));
fs.read(fd, { position: 0 }, common.mustCall((err, bytesRead, buffer) => {
  assert.strictEqual(bytesRead, expected.length);
  assert.deepStrictEqual(defaultBufferAsync.length, buffer.length);
}));
fs.read(fd, {
  buffer: bufferAsOption,
  offset: 0,
  length: bufferAsOption.length,
  position: 0
},
        common.mustCall((err, bytesRead, buffer) => {
          assert.strictEqual(bytesRead, expected.length);
          assert.deepStrictEqual(bufferAsOption.length, buffer.length);
        }));
